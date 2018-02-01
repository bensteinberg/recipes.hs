function ready(fn) {
  if (document.attachEvent ? document.readyState === "complete" : document.readyState !== "loading"){
    fn();
  } else {
    document.addEventListener('DOMContentLoaded', fn);
  }
}

function drf() {
    var request = new XMLHttpRequest();
    request.open('GET', 'recipes', true);
    request.onload = function() {
	if (request.status >= 200 && request.status < 400) {
	    // Success!
	    var data = JSON.parse(request.responseText);
	    if (window.location.search) {
		var urlParams = new URLSearchParams(window.location.search);
		if (urlParams.has("search")) {
		    var s = decodeURI(urlParams.get('search'));
		    document.querySelector('input').value = s;
		    display_recipes(find_recipes(data, s));
		} else {
		    display_recipes(data);
		}
	    } else {
		display_recipes(data);
	    }
	    var stateObj = { search: "" };
	    var input = document.querySelector('input');
	    input.onkeyup = function() {
		display_recipes(find_recipes(data, input.value));
		history.pushState(stateObj, "search", "?search=" + input.value);
	    };
	} else {
	    // We reached our target server, but it returned an error
	    console.log("no recipes");
	}
    };

    request.onerror = function() {
	// There was a connection error of some sort
	console.log("error");
    };

    request.send();
}

function find_recipes(recipes, text) {
    var filtered = [];
    if (text != '') {
	var tokens = text.split(' ');
	tokens = tokens.filter(function(n) {return n});
	filtered = recipes.filter(function(element, index, array) {
	    var hits = new Array();
	    for (token in tokens) {
		hits[tokens[token]] = 0;
		regex = new RegExp(tokens[token], "i");
		if (element["name"].search(regex) != -1 ||
		    // latinise found at
		    // https://stackoverflow.com/a/9667817/4074877
		    element["name"].latinise().search(regex) != -1) {
		    hits[tokens[token]] += 1;
		} else {
		    for (var item in element["ingredients"]) {
			if (element["ingredients"][item]["ingredient"].search(regex) != -1 ||
			    element["ingredients"][item]["ingredient"].latinise().search(regex) != -1) {
			    hits[tokens[token]] += 1;
			}
		    }
		    if (element["source"].search(regex) != -1) {
			hits[tokens[token]] += 1;
		    }
		}
	    }
	    for (token in tokens) {
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
    var html = "<dl>";
    filtered.sort(function(a,b) {
	var nameA=a.name.toLowerCase(), nameB=b.name.toLowerCase()
	if (nameA < nameB) {
	    return -1
	}
	if (nameA > nameB) {
	    return 1
	}
	return 0 //default return value (no sorting)
    });
    for (recipe in filtered) {
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
