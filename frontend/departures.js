function getDepartures(postcode) {
    var xhttp = new XMLHttpRequest();

    xhttp.open('GET', `http://localhost:3001/departures?postcode=${postcode.value}`, true);

    xhttp.setRequestHeader('Content-Type', 'application/json');

    xhttp.onload = function() {

        if (xhttp.readyState === xhttp.DONE) {
            if (xhttp.status === 200) {
                var jsonResponse = JSON.parse(xhttp.response);
                document.getElementById("stopName1").innerHTML = "<h2>Your results:</h2>"
                document.getElementById("stopName1").innerHTML = `${jsonResponse[0].commonName} towards ${jsonResponse[0].towards}`;
                document.getElementById("stopName2").innerHTML = `${jsonResponse[1].commonName} towards ${jsonResponse[1].towards}`;

                var str = "<ul>"
                var obj = jsonResponse[0];
                for (var key in obj){
                    str += `<li>${key} is ${obj[key]}</li>`;
                }

                //document.getElementById("fullResponse").innerHTML = str;
                 document.getElementById("fullResponse").innerHTML = xhttp.responseText;

            } else {
                console.log(`error? ${xhttp.status}`);
            }
        }
    }
    xhttp.send();
}
