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
		if (urlParams.has('search')) {
		    let s = decodeURI(urlParams.get('search'));
		    document.querySelector('input').value = s;
		    display_recipes(find_recipes(data, s));
		} else {
		    display_recipes(data);
		}
	    } else {
		display_recipes(data);
	    }
	    let stateObj = { search: '' };
	    let input = document.querySelector('input');
	    input.onkeyup = function() {
		display_recipes(find_recipes(data, input.value));
		history.pushState(stateObj, 'search', '?search=' + input.value);
	    };
	} else {
	    console.log('server error - no recipes');
	}
    };
    request.onerror = function() {
	console.log('connection error');
    };
    request.send();
}

// latinise from https://stackoverflow.com/a/9667817/4074877
function test_latinised(regex, text) {
    if (regex.test(text.latinise()) || regex.test(text)) {
	return true;
    } else {
	return false;
    }
}

function find_recipes(recipes, text) {
    let filtered = [];
    if (text != '') {
	let tokens = text.split(' ');
	// get rid of empty tokens
	tokens = tokens.filter(function(n) {return n});
	filtered = recipes.filter(function(r, index, array) {
	    let hits = new Array();
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
			    break;
			}
		    }
		    if (test_latinised(regex, r.source)) {
			hits[tokens[token]] += 1;
		    }
		}
	    }
	    for (const token in tokens) {
		if (hits[tokens[token]] == 0) {
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
    Array.prototype.forEach.call(document.querySelectorAll('dl'), function(el, i){
	el.parentNode.removeChild(el);
    });
    let c = document.querySelector('span#count');
    c.textContent = filtered.length;
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
    let html = "<dl>";
    for (const recipe in filtered) {
	let r = filtered[recipe];
	html += "<dt>";
	html += "<span class='name'>" + r.name + "</span>";
	html += "<span class='source'>" + r.source + "</span>";
	html += "</dt>";
	html += "<dd>";
	for (item in r.ingredients) {
	    let i = r.ingredients[item];
	    html += '<span id="ingredient">' + i.ingredient + '</span>: ';
	    html += i.amount + "<br />";
	}
	html += "</dd>";
    }
    html += "</dl>";
    c.insertAdjacentHTML('afterend', html);
}

ready(drf);
