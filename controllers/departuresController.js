// const Test = require('../models/Test');
// const fetch = require("node-fetch");
// const BusArrivals = require("../models/BusArrivals");

exports.getBusArrivals = async (req, res) => {

    res.render('busArrivalsView', {
        data: busArrivals,
    });
};

