/*
fetch("/data/filtered-json").then(function(res){
    res.json().then(function (data) {

        let h1 = document.getElementById("record_release_count");
        h1.innerHTML = `${data["count"]} records released in the last 24 hours.`;


        fetch("/data/departments-json").then(function(deparment_res){
            deparment_res.json().then(function (department_data) {
                for(let department in data["departments"]){
                    let department_code = data["departments"][department]["code"];
                    create_li("departments", `${department_data["departments"][department_code]} : ${data["departments"][department]["count"]}`)
                }
            })
        });

        if(data["places"].length > 0){
            for(let place in data["places"]){
                create_li("places", `${place} : ${data["places"][place]}`);
            }
        }
        else {
            create_li("places", `None of the documents contain semantics on places.`);
        }

        for(let taxonomy in data["taxonomies"]){
            create_li("taxonomies", `${data["taxonomies"][taxonomy]["code"]} : ${data["taxonomies"][taxonomy]["count"]}`);
        }

        for(let timePeriod in data["time_periods"]){
            create_li("time_periods", `${data["time_periods"][timePeriod]["code"]} : ${data["time_periods"][timePeriod]["count"]}`);
        }

    })

    function create_li(ul_id, inner_html_data) {
        let li = document.createElement("li");
        li.innerHTML = inner_html_data;
        document.getElementById(ul_id).append(li);
    }

});*/
