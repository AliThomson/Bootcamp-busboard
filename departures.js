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
    constructor(naptanId, commonName, towards) {
        this.naptanId = naptanId;
        this.commonName = commonName;
        this.towards = towards;
    }
}
class Arrival {
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
            const getBusStopsUrl = `https://api.tfl.gov.uk/StopPoint/?lat=${coords.result.latitude}&lon=${coords.result.longitude}&stopTypes=NaptanPublicBusCoachTram&radius=1000`;
            return reqPromise(setOptions(getBusStopsUrl));
        })
        .then(busStops => {
            let nearest2BusStops = busStops.stopPoints.slice(0, 2);
            const objNearest2BusStops = nearest2BusStops.map(busStop => {
                return new BusStop(busStop.naptanId, busStop.commonName, busStop.additionalProperties[1].value);
            });

            const busStopPromises = objNearest2BusStops.map(busStop => {
                const arrivalsUrl = `https://api.tfl.gov.uk/StopPoint/${busStop.naptanId}/Arrivals`;
                return reqPromise(setOptions(arrivalsUrl))
                    .then(function(arrivals) {
                        // sort arrivals by timeToStation
                        arrivals.sort(function (a, b) {
                            return a.timeToStation - b.timeToStation;
                        });

                        const firstFiveArrivals = arrivals.slice(0, 5);
                        const objFirstFiveArr = firstFiveArrivals.map(arrival => {
                            return new Arrival(arrival.lineName, arrival.destinationName, arrival.expectedArrival);
                        });

                        busStop.arrivals = objFirstFiveArr;
                        return busStop;
                    })
                    .catch(function (err) {
                        console.log(err);
                    })
                })

            return Promise.all(busStopPromises);
        })
        .catch(function (err) {
            console.log(err);
        })
}

