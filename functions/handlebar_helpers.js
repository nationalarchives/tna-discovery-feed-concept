const globals = require("../functions/globals");

module.exports = {
    get_departments: () => {

        let departments_data = globals.discovery_json["departments"];
        let department_long_names = globals.department_full_names["departments"];

        let return_data = `<ul>`;
        for (let i = 0; i < departments_data.length; i++) {

            let department_code = department_long_names[departments_data[i]["code"]];

            if(department_code === undefined) {
                department_code = departments_data[i]["code"];
            }

            let department_count = departments_data[i]["count"];

            return_data += `<li> ${department_code} : ${department_count} </li>`
        }

        return return_data + "</ul>";
    },

    get_places: () => {
        let places = globals.discovery_json["places"];
        let return_data = `<ul>`;
        if( places.length > 0){

            for(let place in places){
                return_data += `<li> ${place} : ${places[place]} </li>`;
            }

        }
        else {
            return_data += `<li> None of the documents contain semantics on places. </li>`;
        }
        return `${return_data} </ul>`;
    },
    get_taxonomies: () => {
        let taxonomies = globals.discovery_json["taxonomies"];
        let return_data = `<ul>`;
        for(let taxonomy in taxonomies){
           return_data += `<li> ${taxonomies[taxonomy]["code"]} : ${taxonomies[taxonomy]["count"]} </li>`;
        }
        return `${return_data} </ul>`;
    },
    get_time_periods: () => {
        let time_periods = globals.discovery_json["time_periods"];
        let return_data = `<ul>`;
        for(let time_period in time_periods){
            return_data += `<li> ${time_periods[time_period]["code"]} : ${time_periods[time_period]["count"]}`
        }
        return `${return_data} </ul>`;
    },
    get_feed_info: () => {
        let count = globals.discovery_json["count"];
        return `<h1> ${count}  records opened in the last 24 hours.</h1>`
    },
    get_record_titles: () => {
        let return_data = `<ul>`;
        let records = globals.discovery_json["records"];
        for(let record in records) {
            return_data += `<li>${records[record]["description"]} <ul><li>${records[record]["context"]}</li></ul> </li>`;
        }
        return `${return_data} </ul>`;
    },
    get_long_department_name: key => {
       return globals.department_full_names[key];
    },
    get_updated_records_info: () => {
    return `<h1>${globals.updated_records_amount} records updated in the last week.</h1>`;
    },
    get_updated_records: () => {
        let return_data = '<ul>'
        let records = globals.updated_records;

      for(let record_id in globals.updated_records){

          return_data += `<li>
                                <a href="http://discovery.nationalarchives.gov.uk/details/r/${record_id}" target="_blank">${records[record_id]["record"]}</a>
                          </li>`;
      }

      return `${return_data} </ul>`
    }

}