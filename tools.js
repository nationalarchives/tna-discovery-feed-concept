exports.get_discovery_api_as_JSON = (yesterday_ISO_string, today_ISO_string, fetch) => {
   const url = `http://discovery.nationalarchives.gov.uk/API/search/records?sps.heldByCode=TNA&sps.recordOpeningFromDate=${yesterday_ISO_string}&sps.recordOpeningToDate=${today_ISO_string}&sps.searchQuery=*&sps.sortByOption=DATE_ASCENDING&sps.resultsPageSize=1000`;

  return fetch(url).then((response) => {
   return response.json();
  });

};

exports.filter_JSON_data = (the_json) => {

    let places = {};
    let records = {};
        // For each record, push it to the next index in a new object and map it's title, desc, context to the new object.
        the_json["records"].forEach(function (data) {

            records[Object.keys(records).length] = {
                title: data.title,
                description: data.description,
                context: data.context // Different to the record title, usually contains more info about the record.
            };

                data["places"].forEach(function (place) {
                    // Some entries have are whitespace, so check if the string still exists after trimmed.
                    if (place.trim()) {

                        // If place already exists in object, increment by 1, else add it to the object with value of 1.
                        if (place in places) {
                            places[place]++;
                        }
                        else {
                            places[place] = 1;
                        }
                    }

                });

        });

    // Get every department and map it's count to this object
    let departments = {};
        the_json["departments"].forEach(function (department) {

            // Example output: departments["WO"] = 5 means 5 records opened in the War Office.
            departments[department["code"]] = department["count"];
        });

    return {
        count: the_json["count"], // Amount of records in total
        departments,
        taxonomies: the_json["taxonomySubjects"],
        time_periods: the_json["timePeriods"],
        places,
        records
    };

};
