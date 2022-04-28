var express = require('express');
var router = express.Router();
const {getDepartures} = require('../departures');

/* GET departures page. */

router.get('/', async function(req, res, next) {
  const combinedArrivals = await getDepartures("W139DE");
  combinedArrivals.forEach(bus => {
    console.log(`CombinedArrivals: ${bus.stopName}, ${bus.line}, ${bus.destination}, ${bus.arrivalTime}`);
  })
  await res.render('departures', { title: 'Departures', busArrivals: combinedArrivals });
});

module.exports = router;
