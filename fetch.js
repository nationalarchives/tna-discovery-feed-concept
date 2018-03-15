fetch("/get/filtered-json").then(function(res){
    res.json().then(function (data) {


        let h1 = document.createElement("h1");
        h1.innerHTML = `${data["count"]} records released in the last 24 hours.`;
        document.body.appendChild(h1);




        for(department in data["departments"]){

            let li = document.createElement("li");
            li.innerHTML = ` ${data["departments"][department]["code"]} : ${data["departments"][department]["count"]}`;
            document.getElementById("departments").append(li);
        }

        for(place in data["places"]){
            let li = document.createElement("li");
            li.innerHTML = ` ${place} : ${data["places"][place]}`;
            document.getElementById("places").append(li);
        }



    })
});