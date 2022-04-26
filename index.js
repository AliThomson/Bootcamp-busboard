const request = require('request');
const readlineSync = require('readline-sync');

const inpBusStop = readlineSync.question("Please input bus stop code: ");

const arrivalsUrl = `https://api.tfl.gov.uk/StopPoint/${inpBusStop}/Arrivals`; //490009201E
//const getCoordsUrl = `https://api.postcodes.io/postcodes/${inpPostCode}`;

request(arrivalsUrl, function (error, response, arrivalsResponse) {
    if (error) {
        console.error('error:', error);
        console.log('statusCode:', response && response.statusCode);
    } else {
        const arrivals = JSON.parse(arrivalsResponse)
        try {
            if (arrivals != "") {

                arrivals.sort(function (a, b) {
                    return a.expectedArrival.substring(11, 16).localeCompare(b.expectedArrival.substring(11, 16));
                });

                const firstFiveArrivals = arrivals.slice(0, 5);
                firstFiveArrivals.forEach(bus => {
                    console.log(`Bus no. ${bus.lineName} to ${bus.destinationName} is arriving at ${bus.expectedArrival.substring(11, 16)}`);
                })
            } else {
                throw "Sorry, no buses scheduled to arrive";
            }
        }
        catch (err) {
            console.log(err);
        }
    }
});