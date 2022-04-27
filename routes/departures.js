var express = require('express');
var router = express.Router();
const {getDepartures} = require('../departures');

/* GET departures page. */
const combinedArrivals = getDepartures();

router.get('/', function(req, res, next) {
  res.render('departures', { title: 'Departures', busArrivals: combinedArrivals });
});

module.exports = router;
