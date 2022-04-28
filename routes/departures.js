var express = require('express');
var router = express.Router();
const {getDepartures} = require('../departures');

/* GET departures page. */

router.get('/', async function(req, res, next) {
  const combinedArrivals = await getDepartures("W139DE");
  res.json(combinedArrivals);
      // .then(result => {
      //   console.log(`CombinedArrivals = ${combinedArrivals.stopName}`)
      //   res.render('departures', {title: 'Departures', busArrivals: combinedArrivals})
      // });
});
// router.get('/', async function(req, res, next) {
//   await getDepartures("W139DE")
//       .then((combinedArrivals) => {
//         console.log(`CombinedArrivals = ${combinedArrivals.stopName}`);
//         res.render('departures', {title: 'Departures', busArrivals: combinedArrivals});
//       })
// })

module.exports = router;

