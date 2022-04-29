function getDepartures(postcode) {
    var xhttp = new XMLHttpRequest();

    xhttp.open('GET', `http://localhost:3001/departures?postcode=${postcode.value}`, true);

    xhttp.setRequestHeader('Content-Type', 'application/json');

    xhttp.onload = function() {

        if (xhttp.readyState === xhttp.DONE) {
            if (xhttp.status === 200) {
                var jsonResponse = JSON.parse(xhttp.response);
                document.getElementById("resultsHeader").innerHTML = "<h2>Your results:</h2>";

                jsonResponse.forEach(busStop => {
                    let stopName = document.createElement("h3");
                    stopName.id = busStop.commonName;
                    stopName.innerHTML = `${busStop.commonName} towards ${busStop.towards}`;
                    document.body.appendChild(stopName);

                    let list = document.createElement("ul", { is : 'expanding-list' })
                    list.id = busStop.commonName;
                    document.body.appendChild(list);

                    busStop.arrivals.forEach(arrival => {
                        let gmtTime = new Date(arrival.arrivalTime);
                        let localTime = gmtTime.toLocaleTimeString('en-GB');
                        let li = document.createElement("li");
                        li.innerText = `${arrival.line} to ${arrival.destination} arriving at ${localTime}`;
                        list.appendChild(li);
                    });
                })
            } else {
                console.log(`error? ${xhttp.status}`);
            }
        }
    }
    xhttp.send();
}
// arrival.arrivalTime.substring(11,16)


