fetch("/get/filtered-json").then(function(res){
    res.json().then(function (data) {


        let h1 = document.createElement("h1");
        h1.innerHTML = `${data["count"]} records released in the last 24 hours.`;

        let departments = document.createElement("ul");


        for(department in data["departments"]){
            let li = document.createElement("li");
            li.innerHTML = ` ${department} : ${data["departments"][department]}`;
            departments.append(li);
        }



        document.body.appendChild(h1);
        document.body.appendChild(departments);
    })
});