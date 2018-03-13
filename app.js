const express = require("express");
const app = express();
const fetch = require("node-fetch");

let parsedJSON = '...';

app.use("/", express.static(__dirname + '/'));

app.get("/", function (req, res) {
    res.sendFile(__dirname + 'index.html');
});

app.get("/get/discovery-api-json", function (req, res) {
    if(parsedJSON === '...'){
        res.send(JSON.stringify({error: "The server has not finished loading the JSON."}));
    }
    else {
        res.send(JSON.stringify(parsedJSON));
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

    const getJSON = async url => {
        try {
            const http_response = await fetch(url);
            const discoveryJSON = await http_response.json();
            parsedJSON = discoveryJSON;
        }
        catch (error) {
            return {error: error};
        }
    }

   getJSON(url);
}


