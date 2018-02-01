'use strict';

function ready(fn) {
    document.addEventListener("DOMContentLoaded", fn);
}

function go() {
    let request = new XMLHttpRequest();
    request.open("GET", "recipes", true);
    request.onload = function () {
        if (request.status >= 200 && request.status < 400) {
            let data = JSON.parse(request.responseText);
            if (window.location.search) {
                let urlParams = new URLSearchParams(window.location.search);
                if (urlParams.has("search") && urlParams.get("search")) {
                    let s = decodeURI(urlParams.get("search"));
                    document.querySelector("input").value = s;
                    display_recipes(find_recipes(data, s));
                } else {
                    display_recipes(data);
                }
            } else {
                display_recipes(data);
            }
            let stateObj = { search: "" };
            let input = document.querySelector("input");
            input.onkeyup = function () {
                display_recipes(find_recipes(data, input.value));
                history.pushState(stateObj, "search", "?search=" + input.value);
            };
        } else {
            err("Server status " + request.status + " - no recipes today");
        }
    };
    request.onerror = function() {
        err("Connection error - no recipes today");
    };
    request.send();
}

function err(text) {
    document.querySelector("input").outerHTML = "<p>" + text + "</p>";
}

// latinise from https://stackoverflow.com/a/9667817/4074877
function test_latinised(regex, text) {
    return (regex.test(text.latinise()) || regex.test(text));
}

function find_recipes(recipes, text) {
    let filtered = [];
    if (text != "") {
        let tokens = text.split(" ");
        // get rid of empty tokens
        tokens = tokens.filter(function (n) {return n;});
        filtered = recipes.filter(function (r) {
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
    } else {
        filtered = recipes;
    }
    return filtered;
}

function display_recipes(filtered) {
    Array.prototype.forEach.call(document.querySelectorAll("dl"), function (el) {
        el.parentNode.removeChild(el);
    });
    let c = document.querySelector("span#count");
    c.textContent = filtered.length;
    filtered.sort(function (a, b) {
        return a.name.localeCompare(b.name);
    });
    let html = "<dl>";
    for (const recipe in filtered) {
        let r = filtered[recipe];
        html += "<dt>";
        html += "<span class='name'>" + r.name + "</span>";
        html += "<span class='source'>" + r.source + "</span>";
        html += "</dt>";
        html += "<dd>";
        for (const item in r.ingredients) {
            let i = r.ingredients[item];
            html += "<span id='ingredient'>" + i.ingredient + "</span>: ";
            html += i.amount + "<br />";
        }
        html += "</dd>";
    }
    html += "</dl>";
    c.insertAdjacentHTML("afterend", html);
}

ready(go);
