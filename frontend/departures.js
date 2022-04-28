function getDepartures(postcode) {
    var xhttp = new XMLHttpRequest();

    xhttp.open('GET', `http://localhost:3001/departures?postcode=${postcode.value}`, true);

    xhttp.setRequestHeader('Content-Type', 'application/json');

    xhttp.onload = function() {

        if (xhttp.readyState === xhttp.DONE) {
            if (xhttp.status === 200) {
                var jsonResponse = JSON.parse(xhttp.response);
                document.getElementById("results").innerHTML = jsonResponse[0].naptanId;
                console.log("response: " + xhttp.response);
                console.log("responseText: " + xhttp.responseText);
            } else {
                console.log(`error? ${xhttp.status}`);
            }
        }
    }
    xhttp.send();
}

