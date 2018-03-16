fetch("/get/filtered-json").then(function(res){
    res.json().then(function (data) {

        let h1 = document.getElementById("record_release_count");
        h1.innerHTML = `${data["count"]} records released in the last 24 hours.`;

        for(department in data["departments"]){

            let li = document.createElement("li");
            li.innerHTML = ` ${data["departments"][department]["code"]} : ${data["departments"][department]["count"]}`;
            document.getElementById("departments").append(li);
        }

        if(data["places"].length > 0){
            for(place in data["places"]){
                let li = document.createElement("li");
                li.innerHTML = ` ${place} : ${data["places"][place]}`;
                document.getElementById("places").append(li);
            }
        }
        else {
            let li = document.createElement("li");
            li.innerHTML = `None of the documents contain semantics on places.`;
            document.getElementById("places").append(li);
        }



        for(taxonomy in data["taxonomies"]){
            let li = document.createElement("li");
            li.innerHTML = ` ${data["taxonomies"][taxonomy]["code"]} : ${data["taxonomies"][taxonomy]["count"]}`;
            document.getElementById("taxonomies").append(li);

        }

    })
});