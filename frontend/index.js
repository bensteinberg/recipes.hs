import { createApp } from 'vue';

createApp({
  data() {
    return {
      recipes: [],
      search: '',
      loading: true,
      errored: false
    }
  },
  filters: {
    toURL(s) {
       return s.split(" ").map((w) => w.startsWith('http') ? `<a href="${w}">${new URL(w).hostname}</a>` : w).join(" ");
    }
  },
  mounted: function () {
    this.search = new URLSearchParams(window.location.search).get("search") || '';
    fetch('recipes')
      .then(response => response.json())
      .then(json => this.recipes = json)
      .catch(error => {
        console.log(error)
        this.errored = true
      })
      .finally(() => this.loading = false);
  },
  watch: {
    search: function(newSearch, oldSearch) {
      let stateObj = { search: "" };
      history.pushState(stateObj, "search", "?search=" + newSearch);
    }
  },
  computed: {
    augmentedRecipes: function () {
      return this.recipes.map(function(r) {
	if (r.tags) {
	  r.tags = r.tags.map(function(t) {
	    return "tag:"+t;
	  });
	}
	return r;
      });
    },
    filteredRecipes: function () {
      // latinise from https://stackoverflow.com/a/9667817/4074877
      String.prototype.normalise = function() {
        return this.latinise().toLowerCase();
      }
      let tokens = this.search.split(" ").filter(a => a);
      return this.augmentedRecipes.filter(function(r) {
        let targets = r.ingredients.map(i => i.ingredient.normalise())
            .concat([r.name.normalise(), r.source.normalise()]);
	if (r.tags) {
	  targets = targets.concat(r.tags.map(i => i.normalise()));
	}
        return tokens.map(
          token => targets.map(
            target => target.includes(token.normalise()))
            .some(a => a))
          .every(a => a);
      });
    },
    sortedRecipes: function() {
      return this.filteredRecipes.sort(function(a, b) {
        return a.name.localeCompare(b.name);
      });
    }
  },
  methods: {
    tagClass(tag) {
      const danger = ["typo", "bad"];
      const success = ["fun", "fave", "great"];
      let t = tag.slice(4);
      if (danger.includes(t)) {
	return "danger";
      } else if (success.includes(t)) {
	return "success";
      } else {
	return "info";
      }
    }
  }
}).mount('#app');
