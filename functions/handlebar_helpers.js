const globals = require("../functions/globals");
const fetch = require("node-fetch");

module.exports = {
    departments: function () {
        console.log(globals.departments_json);
        let return_data = `<ul>`;
        for (let i = 0; i < globals.return_object["departments"].length; i++) {
            console.log();
            let department_code = globals.departments_json["departments"][globals.return_object["departments"][i]["code"]];

            if(department_code === undefined) {
                department_code = globals.return_object["departments"][i]["code"];
            }

            let department_count = globals.return_object["departments"][i]["count"];

            return_data = return_data + `<li> ${department_code} : ${department_count} </li>`
        }

        return return_data + "</ul>";
    },
    places: function () {
        let return_data = `<ul>`;
        if( globals.return_object["places"].length > 0){

            for(let place in globals.return_object["places"]){
                return_data = return_data + `<li> ${place} : ${data["places"][place]} </li>`;
            }

        }
        else {
            return_data = return_data + `<li> None of the documents contain semantics on places. </li>`;
        }
        return return_data + "</ul>";
    }
}