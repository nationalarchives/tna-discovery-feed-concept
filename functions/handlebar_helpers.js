const globals = require("../functions/globals");
const fetch = require("node-fetch");

module.exports = {
    departments: function (context, options) {
    let return_data = `<ul>`;
    for(let i = 0; i < globals.return_object["departments"].length; i++){

        let department_code =  globals.return_object["departments"][i]["code"];
        let department_count =  globals.return_object["departments"][i]["count"];

        return_data = return_data + `<li> ${department_code} : ${department_count} </li>`
    }

    return return_data + "</ul>";
},
places: function (context, options) {
    if(data["places"].length > 0){
        for(let place in data["places"]){
            create_li("places", `${place} : ${data["places"][place]}`);
        }
    }
    else {
        create_li("places", `None of the documents contain semantics on places.`);
    }
}
}