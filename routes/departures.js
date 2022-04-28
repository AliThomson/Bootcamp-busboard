var express = require('express');
var router = express.Router();
const {getDepartures} = require('../departures');

/* GET departures page. */

router.get('/', async function(req, res, next) {
  const postcode = req.query.postcode;
  const combinedArrivals = await getDepartures(postcode);
  res.json(combinedArrivals);
      // .then(result => {
      //   console.log(`CombinedArrivals = ${combinedArrivals.stopName}`)
      //   res.render('departures', {title: 'Departures', busArrivals: combinedArrivals})
      // });
});

module.exports = router;

