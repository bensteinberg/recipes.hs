import Vue from 'vue';
import axios from 'axios';

new Vue({
    el: '#app',
    data: {
        recipes: [],
        search: '',
        loading: true,
        errored: false
    },
    filters: {
        toURL(s) {
            return (s.startsWith('http') ? `<a href="${s}">${new URL(s).hostname}</a>` : s);
        }
    },
    mounted: function () {
        this.search = new URLSearchParams(window.location.search).get("search") || '';
        axios.get('recipes')
            .then(response => this.recipes = response.data)
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
        filteredRecipes: function () {
            // latinise from https://stackoverflow.com/a/9667817/4074877
            String.prototype.normalise = function() {
                return this.latinise().toLowerCase();
            }
            let tokens = this.search.split(" ").filter(a => a);
            return this.recipes.filter(function(r) {
                let targets = r.ingredients.map(i => i.ingredient.normalise())
                    .concat([r.name.normalise(), r.source.normalise()]);
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
    }
});
