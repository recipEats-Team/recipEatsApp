//https://www.taniarascia.com/how-to-connect-to-an-api-with-javascript/

//Retrieving the data with an HTTP request
//var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
var XMLHttpRequest = require("xhr2");
var request = new XMLHttpRequest;


var recipes = [];

request.open('GET', 'https://www.food2fork.com/api/search?key=b608fc52e7a39e465582bd652ae336d9&q=bacon,tomato,lettuce,bread&page=2', true)
request.onload = function() {
    if (request.status >= 200 && request.status < 400) {
        var data = JSON.parse(this.response);
        var topThree = data.recipes.slice(0,3);
        for(var element of topThree){
            var currentRecipe = {};
            currentRecipe["recipe_title"] = element.title;
            currentRecipe["recipe_url"] = element.source_url;
            currentRecipe["recipe_image"] = element.image_url;
            recipes.push(currentRecipe);
        }
    } else {
        console.log("error");
    }
    console.log(recipes);
};

request.send()
