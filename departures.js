// const readlineSync = require('readline-sync');
const request = require('request');
const reqPromise = require('request-promise-native');
const {setOptions} = require('./requests');
const {isValidPostcode} = require('./validation');

// let inpPostcode = "";
// while (isValidPostcode(inpPostcode) === false) {
//     try {
//         inpPostcode = readlineSync.question("Please input your postcode: ");
//         if (isValidPostcode(inpPostcode) === false) {
//             throw "Invalid Postcode";
//         }
//     } catch (err) {
//         inpPostcode = "";
//         console.log("Postcode is invalid - please try again", err);
//     }
// }

class BusStop {
    naptanId;
    commonName;
    towards;
    constructor(naptanId, commonName, towards) {
        this.naptanId = naptanId;
        this.commonName = commonName;
        this.towards = towards;
    }
}
class Arrival {
    line;
    destination;
    arrivalTime;
    constructor(line, destination, arrivalTime) {
        this.line = line;
        this.destination = destination;
        this.arrivalTime = arrivalTime;
    }
}

exports.getDepartures = async function(inpPostcode) {

    const getCoordsUrl = `https://api.postcodes.io/postcodes/${encodeURI(inpPostcode)}`;

    return reqPromise(setOptions(getCoordsUrl))
        .then(function (coords) {
            return getBusStopsUrl = `https://api.tfl.gov.uk/StopPoint/?lat=${coords.result.latitude}&lon=${coords.result.longitude}&stopTypes=NaptanPublicBusCoachTram&radius=1000`;
        })
        .then(busStops => reqPromise(setOptions(getBusStopsUrl)))
        .catch(function (err) {
            console.log(err);
        })
        .then(busStops => {
            let nearest2BusStops = busStops.stopPoints.slice(0, 2);
            // if I put a return on 56 and 57 it's the nearest2BusStops that get's returned by the API, not combinedArrivals
             nearest2BusStops.map(busStop => {
                console.log("here");
                new BusStop(busStop.naptanId, busStop.commonName, busStop.additionalProperties[1].value);
            });
            let combinedArrivals = [[]];

            for (let i = 0; i < nearest2BusStops.length; i++) {
                const arrivalsUrl = `https://api.tfl.gov.uk/StopPoint/${nearest2BusStops[i].naptanId}/Arrivals`;
                return reqPromise(setOptions(arrivalsUrl))
                    .then(function(arrivals) {
                        // sort arrivals by time
                        arrivals.sort(function (a, b) {
                            return a.expectedArrival.substring(11, 16).localeCompare(b.expectedArrival.substring(11, 16));
                        });

                        const firstFiveArrivals = arrivals.slice(0, 5);
                        // for each arrival push a [{bustop}:[{arrival}]]
                        for (let j = 0; j < firstFiveArrivals.length; j++) {
                           combinedArrivals.push([nearest2BusStops[i][new Arrival(
                                firstFiveArrivals[j].lineName,
                                firstFiveArrivals[j].destinationName,
                                firstFiveArrivals[j].expectedArrival
                            )]]);
                        }
                        // debugging
                        for (let j = 0; j < combinedArrivals.length; j++) {
                            console.log(`station name: ${combinedArrivals[j]}`);
                        }
                        return combinedArrivals;
                    })
                    .catch(function (err) {
                        console.log(err);
                    })
                }
                return combinedArrivals; // This doesn't hold arrivals info yet
        })
        .catch(function (err) {
            console.log(err);
        })
}
// console.log(`nearest2BusStops[i]: ${nearest2BusStops[i].commonName} towards ${nearest2BusStops[i].towards}`);
//console.log(`firstFiveArrivals[j].lineName: ${firstFiveArrivals[j].lineName}`);
