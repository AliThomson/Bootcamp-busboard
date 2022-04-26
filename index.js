const readlineSync = require('readline-sync');
const request = require('request');

const {getResponse} = require('./requests');
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

let coords = "";
let latitude = "";
let longitude = "";
const getCoordsUrl = `https://api.postcodes.io/postcodes/${encodeURI(inpPostcode)}`;
const getCoords = async () => {
    coords = await getResponse(getCoordsUrl);
    latitude = coords.result.latitude;
    longitude = coords.result.longitude;

    const getBusStopsUrl = `https://api.tfl.gov.uk/StopPoint/?lat=${latitude}&lon=${longitude}&stopTypes=NaptanPublicBusCoachTram&radius=1000`
    const getBusStops = async () => {
        busStops = await getResponse(getBusStopsUrl);
        const nearest2BusStops = busStops.stopPoints.slice(0,2);
        nearest2BusStops.forEach(busStop => {
            console.log(`Bus stop: ${busStop.commonName}`)
            const arrivalsUrl = `https://api.tfl.gov.uk/StopPoint/${busStop.naptanId}/Arrivals`; //490009201E
            let arrivals = [];
            const getArrivals = async () => {
                arrivals = await getResponse(arrivalsUrl);
                arrivals.sort(function (a, b) {
                    return a.expectedArrival.substring(11, 16).localeCompare(b.expectedArrival.substring(11, 16));
                });

                const firstFiveArrivals = arrivals.slice(0, 5);
                firstFiveArrivals.forEach(bus => {
                    console.log(`Bus no. ${bus.lineName} to ${bus.destinationName} is arriving at ${bus.expectedArrival.substring(11, 16)}`);
                })
            }
            getArrivals();
        })
    }
    getBusStops();
}
getCoords();