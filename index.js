const readlineSync = require('readline-sync');
const request = require('request');
const reqPromise = require('request-promise-native');
const {setOptions} = require('./requests');
const {isValidPostcode} = require('./validation');

let inpPostcode = "";
while (isValidPostcode(inpPostcode) === false) {
    try {
        inpPostcode = readlineSync.question("Please input your postcode: ");
        if (isValidPostcode(inpPostcode) === false) {
            throw "Invalid Postcode";
        }
    } catch (err) {
        inpPostcode = "";
        console.log("Postcode is invalid - please try again", err);
    }
}

const getCoordsUrl = `https://api.postcodes.io/postcodes/${encodeURI(inpPostcode)}`;

reqPromise(setOptions(getCoordsUrl))
    .then(function (coords)
    {
        return getBusStopsUrl = `https://api.tfl.gov.uk/StopPoint/?lat=${coords.result.latitude}&lon=${coords.result.longitude}&stopTypes=NaptanPublicBusCoachTram&radius=1000`;
    })
    .then(busStops => reqPromise(setOptions(getBusStopsUrl)))
    .then(busStops => {
        const nearest2BusStops = busStops.stopPoints.slice(0,2);
        nearest2BusStops.forEach(busStop => {
            console.log(`Bus stop: ${busStop.commonName}`);
            const arrivalsUrl = `https://api.tfl.gov.uk/StopPoint/${busStop.naptanId}/Arrivals`;
            reqPromise(setOptions(arrivalsUrl))
            .then(function(arrivals) {
                arrivals.sort(function (a, b) {
                    return a.expectedArrival.substring(11, 16).localeCompare(b.expectedArrival.substring(11, 16));
                    });

                const firstFiveArrivals = arrivals.slice(0, 5);
                firstFiveArrivals.forEach(bus => {
                    console.log(`Bus no. ${bus.lineName} to ${bus.destinationName} is arriving at ${bus.expectedArrival.substring(11, 16)}`);
                })
            })
        })
    })
    .catch(function (err) {
        console.log(err);
    });