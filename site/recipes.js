function ready(fn) {
  if (document.attachEvent ? document.readyState === "complete" : document.readyState !== "loading"){
    fn();
  } else {
    document.addEventListener('DOMContentLoaded', fn);
  }
}

function drf() {
    let request = new XMLHttpRequest();
    request.open('GET', 'recipes', true);
    request.onload = function() {
	if (request.status >= 200 && request.status < 400) {
	    // Success!
	    let data = JSON.parse(request.responseText);
	    if (window.location.search) {
		let urlParams = new URLSearchParams(window.location.search);
		if (urlParams.has("search")) {
		    let s = decodeURI(urlParams.get('search'));
		    document.querySelector('input').value = s;
		    display_recipes(find_recipes(data, s));
		} else {
		    display_recipes(data);
		}
	    } else {
		display_recipes(data);
	    }
	    let stateObj = { search: "" };
	    let input = document.querySelector('input');
	    input.onkeyup = function() {
		display_recipes(find_recipes(data, input.value));
		history.pushState(stateObj, "search", "?search=" + input.value);
	    };
	} else {
	    console.log("server error - no recipes");
	}
    };

    request.onerror = function() {
	console.log("connection error");
    };

    request.send();
}

function find_recipes(recipes, text) {
    let filtered = [];
    if (text != '') {
	let tokens = text.split(' ');
	tokens = tokens.filter(function(n) {return n});
	filtered = recipes.filter(function(element, index, array) {
	    let hits = new Array();
	    for (const token in tokens) {
		hits[tokens[token]] = 0;
		let regex = new RegExp(tokens[token], "i");
		// latinise from https://stackoverflow.com/a/9667817/4074877
		if (regex.test(element['name'].latinise()) ||
		    regex.test(element['name'])) {
		    hits[tokens[token]] += 1;
		} else {
		    for (const item in element["ingredients"]) {
			if (regex.test(element["ingredients"][item]["ingredient"].latinise()) ||
			    regex.test(element["ingredients"][item]["ingredient"])) {
			    hits[tokens[token]] += 1;
			    break;
			}
		    }
		    if (regex.test(element["source"].latinise()) ||
			regex.test(element["source"])) {
			hits[tokens[token]] += 1;
		    }
		}
	    }
	    for (const token in tokens) {
		if (hits[tokens[token]] == 0) {
		    return false;
		}
	    }
	    return(true);
	});
    } else {
        filtered = recipes;
    }
    return filtered;
}

function display_recipes(filtered) {
    Array.prototype.forEach.call(document.querySelectorAll('dl'), function(el, i){
	el.parentNode.removeChild(el);
    });
    document.querySelector('span#count').textContent = filtered.length;
    let html = "<dl>";
    filtered.sort(function(a,b) {
	let nameA=a.name.toLowerCase(), nameB=b.name.toLowerCase()
	if (nameA < nameB) {
	    return -1
	}
	if (nameA > nameB) {
	    return 1
	}
	return 0 //default return value (no sorting)
    });
    for (const recipe in filtered) {
	html = html +  "<dt><span class='name'>" + filtered[recipe]["name"] + "</span><span class='source'>" + filtered[recipe]["source"] + "</span></dt>";
	html = html +  "<dd>";
	for (item in filtered[recipe]["ingredients"]) {
	    html = html + '<span id="ingredient">' + filtered[recipe]["ingredients"][item]["ingredient"] + '</span>';
	    html = html + ": ";
	    html = html + filtered[recipe]["ingredients"][item]["amount"];
	    html = html + "<br />";
	}
	html = html + "</dd>";
    }
    html = html + "</dl>";
    document.querySelector('span#count').insertAdjacentHTML('afterend', html);
}

ready(drf);
