"use strict"

window.onload = init;

//globals
var string, input, button, magic_url, imgUrl, content, new_magic_url, allResults, page;
var ebay_url, ebayResponse, ebay_obj, ebay_success = false;
var colors;

function init(){

  // get input value and content div
  string = document.getElementById("string");
  content = $("<div>");
	content.attr("id", "content");
  page = 1;

  $(document).keypress(function(e) {
      if(e.which == 13) {
          page = 1;
          getCards();
      }
  });
  //sets all filters
  colors = {
      green: false,
      red: false,
      blue: false,
      white: false,
      black: false
  };
  setUpFilters();

  // API urls
  magic_url = "https://api.deckbrew.com/mtg/cards?";
	ebay_url = "https://svcs.ebay.com/services/search/FindingService/v1?OPERATION-NAME=findItemsByKeywords&SERVICE-VERSION=1.0.0&SECURITY-APPNAME=Barnacle-ffc8-401a-a7ae-72d054245150&RESPONSE-DATA-FORMAT=JSON&REST-PAYLOAD&keywords=";

    // get button and hook up event listener
	button = document.getElementById("searchButton");

	button.addEventListener("click", function(){
        page = 1;
        getCards();
    });

}

function setUpFilters(){

	//set up set filter
	$.ajax({
        url: "https://api.deckbrew.com/mtg/sets",
        type: "GET",
        dataType: "json",

        // on success, call jsonLoaded with response
        success: function(response){
            //console.log("flag");
			loadSets(response);
        },
		error: function(sent, FUCKUP, MAGNITUDE){
			console.log(MAGNITUDE);
		}
    });

    //set up supertype filter
	$.ajax({
        url: "https://api.deckbrew.com/mtg/supertypes",
        type: "GET",
        dataType: "json",

        // on success, call jsonLoaded with response
        success: function(response){
            //console.log("flag");
			loadSupertypes(response);
        },
		error: function(sent, FUCKUP, MAGNITUDE){
			console.log(MAGNITUDE);
		}
    });

    //set up type filter
	$.ajax({
        url: "https://api.deckbrew.com/mtg/types",
        type: "GET",
        dataType: "json",

        // on success, call jsonLoaded with response
        success: function(response){
            //console.log("flag");
			loadTypes(response);
        },
		error: function(sent, FUCKUP, MAGNITUDE){
			console.log(MAGNITUDE);
		}
    });

    //set up subtype filter
	$.ajax({
        url: "https://api.deckbrew.com/mtg/subtypes",
        type: "GET",
        dataType: "json",

        // on success, call jsonLoaded with response
        success: function(response){
            //console.log("flag");
			loadSubTypes(response);
        },
		error: function(sent, FUCKUP, MAGNITUDE){
			console.log(MAGNITUDE);
		}
    });
}

function loadSets(obj){
	//console.log(obj);
	var dropdown = $("#sets");

	for(var i in obj){

		var option = $("<option>");
		option.attr("value", obj[i].id);
		option.html(obj[i].name);
		dropdown.append(option);
	}
}

function loadSupertypes(obj){
	//console.log(obj);
	var dropdown = $("#superTypes");

	for(var i in obj){

		var option = $("<option>");
        var supertype = obj[i];

        supertype = supertype.toLowerCase().replace(/\b[a-z]/g, function(letter) {
            return letter.toUpperCase();
        });

		option.attr("value", obj[i]);
		option.html(supertype);
		dropdown.append(option);
	}
}

function loadTypes(obj){
	//console.log(obj);
	var dropdown = $("#types");

	for(var i in obj){

		var option = $("<option>");
        var type = obj[i];

        type = type.toLowerCase().replace(/\b[a-z]/g, function(letter) {
            return letter.toUpperCase();
        });

		option.attr("value", obj[i]);
		option.html(type);
		dropdown.append(option);
	}
}

function loadSubTypes(obj){
	//console.log(obj);
	var dropdown = $("#subTypes");

	for(var i in obj){

		var option = $("<option>");
        var subtype = obj[i];

        subtype = subtype.toLowerCase().replace(/\b[a-z]/g, function(letter) {
            return letter.toUpperCase();
        });

		option.attr("value", obj[i]);
		option.html(subtype);
		dropdown.append(option);
	}
}

function applyFilters(){

	var bySet = $("#sets option:selected");
    var byColor = $(".colors");
    var bySupertype = $("#superTypes option:selected");
    var byType = $("#types option:selected");
    var bySubType = $("#subTypes option:selected");
    var byRarity = $("#rarity option:selected");
    var addedString = "";
    //console.log(byColor);

    if(bySet.val() != ""){
        addedString += "&set=" + bySet.val();
    }

    if(byColor[0].checked){
        colors.red = true;
        addedString += "&color=red";
    }
    else{
        colors.red = false;
    }

    if(byColor[1].checked){
        colors.green = true;
        addedString += "&color=green";
    }
    else{
        colors.green = false;
    }

    if(byColor[2].checked){
        colors.white = true;
        addedString += "&color=white";
    }
    else{
        colors.white = false;
    }

    if(byColor[3].checked){
        colors.blue = true;
        addedString += "&color=blue";
    }
    else{
        colors.blue = false;
    }

    if(byColor[4].checked){
        colors.black = true;
        addedString += "&color=black";
    }
    else{
        colors.black = false;
    }

    //console.log(addedString);
    if(bySupertype.val() != ""){
        addedString += "&supertype=" + bySupertype.val();
    }

    if(byType.val() != ""){
        addedString += "&type=" + byType.val();
    }

    if(bySubType.val() != ""){
        addedString += "&subtype=" + bySubType.val();
    }

    if(byRarity.val() != ""){
        addedString += "&rarity=" + byRarity.val();
    }

    return addedString;
}

// ajax calls
function getCards(){

    // create new url before getting data

    if(page>1){
        new_magic_url = magic_url + "page=" + page + "&name=" + string.value + applyFilters();
    }
    else{
        new_magic_url = magic_url + "name=" + string.value + applyFilters();
    }

    //console.log(new_magic_url);

    // ajax call to api for data
    $.ajax({
        url: new_magic_url,
        type: "GET",
        dataType: "json",

        // on success, call jsonLoaded with response
        success: function(response){
            //console.log("flag");
			jsonLoaded(response);
        },
		error: function(sent, FUCKUP, MAGNITUDE){
			console.log(MAGNITUDE);
		}
    });
}

//assign ebay response
function callEbay(name){
	var new_ebay_url = ebay_url + name + "&callback=?";
    //console.log(new_ebay_url);

    $.ajax({
            url:new_ebay_url,
            type: "GET",
            dataType: "jsonp",
            success: function(response){
                addLink(response);
            },
            error: function(sent, FUCKUP, MAGNITUDE){
                console.log(MAGNITUDE);
            }
    });

}

function addLink(obj){

    //console.log(obj);

    var cardNames = document.querySelectorAll("h2.name");
    //console.log(cardNames);

    for(var i = 0; i<cardNames.length; i++){

        if(obj.findItemsByKeywordsResponse[0].ack[0] == "Failure"){
            break;
        }

        var searchedURL = obj.findItemsByKeywordsResponse[0].itemSearchURL[0];
        var encodedName = encodeURIComponent(cardNames[i].innerHTML);
        encodedName = encodedName.split("'").join("%27");
        encodedName = encodedName.split("%20").join("+");
        //console.log(searchedURL);
        //console.log(encodedName);

        if(searchedURL.toString().indexOf(encodedName) >= 0){

            // create and set html elements for ebay link
            var ebayLinkElement = document.createElement("a");
            ebayLinkElement.innerHTML = "Click here for Ebay search";
            ebayLinkElement.setAttribute("href", obj.findItemsByKeywordsResponse[0].itemSearchURL[0]);

            cardNames[i].parentNode.appendChild(ebayLinkElement);
            break;
        }
    }
}

// parse through data
function jsonLoaded(object){
    // print out object and length of array to easily see the data
    //console.log(object);
    //console.log(object.length);

    // empty the content div before displaying any new results
    content.empty();

	//if object array is not empty, create the content div

	$("body").append(content);

	if(object.length > 0){
        $("p").remove();
	}
    else{
        //$("#content").remove();
        var noResults = $("<p>");
        noResults.html("Card was not found");

        $("#content").append(noResults);
        return;
    }

    // put object array in a new variable for readability
    allResults = object;
    //console.log(allResults);
    //console.log(colors);
    // new variables for the data
    var name, types, cost, rarity, tcgPlayerURL, tcgLow, tcgMed, tcgHigh, set, img;

    // loop and parse the data
    for(var i = 0; i<allResults.length; i++){

        // set new variables to the corresponding values in the object array based on the for loop
        name = allResults[i].name;
        types = allResults[i].types[0].charAt(0).toUpperCase() + allResults[i].types[0].slice(1);
        cost = allResults[i].cost;
        rarity = allResults[i].editions[0].rarity.charAt(0).toUpperCase() + allResults[i].editions[0].rarity.slice(1);
        tcgPlayerURL = allResults[i].editions[0].store_url;
        set = allResults[i].editions[0].set;
        img = allResults[i].editions[allResults[i].editions.length - 1].image_url;

        // create new html elements to add the data to
        var div = $("<div>");
        div.addClass("card");

        var nameElement = $("<h2>");
        nameElement.addClass("name");

        var typeElement = $("<p>");
        var costElement = $("<p>");
        var rareElement = $("<p>");
        var tcgElement = $("<section>");
        var lowElement = $("<p>");
        var medElement = $("<p>");
        var highElement = $("<p>");
        var imgElement = $("<img>");
        var setElement = $("<p>");
        var tcgHeaderElement = $("<h3>");

        // set the element data to the variables created earlier
        nameElement.html(name);
        typeElement.html("Type: " + types);
        costElement.html("Mana Cost: " + cost);
        rareElement.html("Rarity: " + rarity);
        imgElement.attr("src", img);
        imgElement.attr("width", 200);
        imgElement.attr("height", 288);
        setElement.html("Set: " + set);
        tcgHeaderElement.html("TCGPlayer.com estimated pricing");

        name = encodeURIComponent(name);
        //console.log(name);
        callEbay(name);


        // if there is a price listed in the data
        if(allResults[i].editions[0].price != undefined){

            // there are no decimal places in the values so in the data, 2.00 looks like 200
            // so this should fix that
            // if the price value is listed as lower than 1
            if(allResults[i].editions[0].price.low < 1){
                // if something does have a decimal place then do nothing
                // it kinda looks wierd when you get values like .20 though because they show up like .2
                // im not sure how to get around this
                tcgLow = allResults[i].editions[0].price.low;
            }//end if
            // if the number is greater than 1
            else{
                tcgLow = allResults[i].editions[0].price.low/100;
                lowElement.html("TCG Low price: $" + tcgLow);
            }//end else
        }//end if
        // no price listed in the data
        else{
            lowElement.html("TCG Low price: Could not retrieve estimated pricing");
        }//end else

        // same thing for high price
        if(allResults[i].editions[0].price != undefined){
            if(allResults[i].editions[0].price.high < 1){
                tcgHigh = (allResults[i].editions[0].price.high*100)/100;
            }//end if
            else{
                tcgHigh = allResults[i].editions[0].price.high/100;
                highElement.html("TCG High price: $" + tcgHigh);
            }//end else
        }//end if
        else{
            highElement.html("TCG High price: Could not retrieve estimated pricing");
        }//end else

        // same thing for med price
        if(allResults[i].editions[0].price != undefined){
            if(allResults[i].editions[0].price.median < 1){
                tcgMed = (allResults[i].editions[0].price.median*100)/100;
            }//end if
            else{
                tcgMed = allResults[i].editions[0].price.median/100;
                medElement.html("TCG Median price: $" + tcgMed);
            }//end else
        }//end if
        else{
            medElement.html("TCG Median price: Could not retrieve estimated pricing");
        }//end else

        //append the different price-list items to the un-ordered list element above
        tcgElement.append(lowElement);
        tcgElement.append(medElement);
        tcgElement.append(highElement);

        // append everything to a div element
        div.append(nameElement);
        div.append(imgElement);
        div.append(typeElement);
        div.append(costElement);
        div.append(rareElement);
        div.append(setElement);
        div.append(tcgHeaderElement);
        div.append(tcgElement);

        // append the div element to the content div
        content.append(div);


        // if it is not the last item in the array, add a line to tell where one item ends and the other begins
        if(i < allResults.length - 1){
            content.append($("<hr>"));


        }//end if

        if(i==allResults.length-1){
            //console.log(i);
             //if there are more than 100 results make pages
            if(allResults.length == 100){
                var next, prev;
                next = $("<button>");
                prev = $("<button>");

                next.attr("id", "nextButton");
                prev.attr("id", "prevButton");

                content.append(prev);
                prev.hide();

                next.click(function(){
                    //console.log("called");
                    //console.log(page);
                    page++;
                    getCards();
                });

                prev.click(function(){

                    page--;
                    getCards();
                });

                next.html("Next Page -->");
                content.append(next);
                if(page>1){

                    prev.html("<-- Previus Page");
                    prev.show();
                }
                else{
                    $("#prevButton").remove();
                }
            }
            else{
                $("#nextButton").remove();
            }
        }
    }//end for
}//end jsonLoaded
