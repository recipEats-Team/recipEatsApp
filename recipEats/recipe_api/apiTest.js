//https://www.taniarascia.com/how-to-connect-to-an-api-with-javascript/

//Retrieving the data with an HTTP request
//var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
var XMLHttpRequest = require("xhr2");
var request = new XMLHttpRequest;

request.open('GET', 'https://www.food2fork.com/api/search?key=b608fc52e7a39e465582bd652ae336d9&q=bacon,tomatot,lettuce,bread&page=2', true)
request.onload = function() {
    if (request.status >= 200 && request.status < 400) {
        var data = JSON.parse(this.response);
        console.log(data);
    } else {
        console.log("error");
    }
};



request.send()


/*
data.forEach(recipe => {
    console.log(recipe)
})
*/