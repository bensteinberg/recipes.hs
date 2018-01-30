$(document).ready(function() {
    $.getJSON('recipes', function(data) {
	display_recipes(data);
	$("input").keyup(function() {
	    display_recipes(find_recipes(data, $(this).val()));
	});
    });
});

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
		if (element["name"].search(regex) != -1) {
		    hits[tokens[token]] += 1;
		} else {
		    for (var item in element["ingredients"]) {
			if (element["ingredients"][item]["ingredient"].search(regex) != -1) {
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
    $("dl").remove();
    $("span#count").text(filtered.length);
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
    $("span").after(html);
}
