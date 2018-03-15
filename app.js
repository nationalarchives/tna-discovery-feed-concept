const express = require("express");
const app = express();
const fetch = require("node-fetch");

let parsed_JSON = '...';
let return_object = {};



app.use("/", express.static(__dirname + '/'));

app.get("/", function (req, res) {
    res.sendFile(__dirname + 'index.html');
});



app.get("/get/filtered-json", function (req, res) {
    if(parsed_JSON === '...'){
        res.send(JSON.stringify({error: "The server has not finished loading..."}));
    }
    else {

        res.send(JSON.stringify(return_object));
    }
})


app.listen(3000, (error) => {
    if(error){
        console.log("error");
    }
    else {
        console.log("Server running");
    }

    get_discovery_api()
})


function get_discovery_api() {

    //ISO date strings are needed to get todays and yesterdays dates, for the previous 24 hours

    let today = new Date();
    let today_ISO_string = today.toISOString().substring(0,10);

    let yesterday = new Date();
    yesterday.setDate(yesterday.getDate()-1);
    let yesterday_ISO_string = yesterday.toISOString().substring(0,10);

    const url = `http://discovery.nationalarchives.gov.uk/API/search/records?sps.heldByCode=TNA&sps.recordOpeningFromDate=${yesterday_ISO_string}&sps.recordOpeningToDate=${today_ISO_string}&sps.searchQuery=*&sps.sortByOption=DATE_ASCENDING&sps.resultsPageSize=1000`

    const get_JSON = async url => {
        try {
            const http_response = await fetch(url);
            const discoveryJSON = await http_response.json();
            return_object = filter_JSON_data(discoveryJSON);
            parsed_JSON = discoveryJSON;
        }
        catch (error) {
            console.log("API Error: " + error);
           return_object = {count: 0, departments: {error: 0} };
        }
    }

   get_JSON(url);
}

function filter_JSON_data(the_json) {
    let departments = {};
    let places = {}
    the_json["records"].forEach(function (data) {
        if(data["department"] in departments){
            departments[data["department"]]++;
        }
        else {
            departments[data["department"]] = 1;
        }

        if(data["places"].forEach(function (place){

            if(place.trim()){
                if(place in places){
                    places[place]++;
                }
                else {
                    places[place] = 1;
                }
            }

        }));



    });


    console.log(places);

    return { count: the_json["records"].length, departments, places };
}


