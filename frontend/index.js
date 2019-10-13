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
            return (s.startsWith('http') ? `<a href="${s}">${s}</a>` : s);
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
            function test_latinised(regex, text) {
                return (regex.test(text.latinise()) || regex.test(text));
            }
            let tokens = this.search.split(" ");
            // get rid of empty tokens
            tokens = tokens.filter(function (n) {return n;});
            return this.recipes.filter(function(r) {
                let hits = [];
                for (const token in tokens) {
                    hits[tokens[token]] = 0;
                    let regex = new RegExp(tokens[token], "i");
                    if (test_latinised(regex, r.name)) {
                        hits[tokens[token]] += 1;
                    } else {
                        for (const item in r.ingredients) {
                            let ingredient = r.ingredients[item].ingredient;
                            if (test_latinised(regex, ingredient)) {
                                hits[tokens[token]] += 1;
                            }
                        }
                        if (test_latinised(regex, r.source)) {
                            hits[tokens[token]] += 1;
                        }
                    }
                }
                for (const token in tokens) {
                    if (hits[tokens[token]] === 0) {
                        return false;
                    }
                }
                return true;
            });
        },
        sortedRecipes: function() {
            return this.filteredRecipes.sort(function(a, b) {
                return a.name.localeCompare(b.name);
            });
        }
    }
});
