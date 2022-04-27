var express = require('express');
var router = express.Router();

/* GET departures page. */

router.get('/', function(req, res, next) {
  res.render('departures', { title: 'Departures', busArrivals: 'Arrivals' });
});

module.exports = router;
