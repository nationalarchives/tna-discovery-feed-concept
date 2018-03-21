const globals = require("../functions/globals");
const fetch = require("node-fetch");

module.exports = {
    departments: function () {

        let departments_data = globals.return_object["departments"];
        let department_long_names = globals.departments_json["departments"];

        let return_data = `<ul>`;
        for (let i = 0; i < departments_data.length; i++) {

            let department_code = department_long_names[departments_data[i]["code"]];

            if(department_code === undefined) {
                department_code = departments_data[i]["code"];
            }

            let department_count = departments_data[i]["count"];

            return_data = return_data + `<li> ${department_code} : ${department_count} </li>`
        }

        return return_data + "</ul>";
    },
    places: function () {
        let places = globals.return_object["places"];
        let return_data = `<ul>`;
        if( places.length > 0){

            for(let place in places){
                return_data = return_data + `<li> ${place} : ${places[place]} </li>`;
            }

        }
        else {
            return_data = return_data + `<li> None of the documents contain semantics on places. </li>`;
        }
        return return_data + "</ul>";
    },
    taxonomies: function () {
        let taxonomies = globals.return_object["taxonomies"];
        let return_data = `<ul>`;
        for(let taxonomy in taxonomies){
           return_data = return_data + `<li> ${taxonomies[taxonomy]["code"]} : ${taxonomies[taxonomy]["count"]} </li>`;
        }
        return return_data + "</ul>";
    }
}