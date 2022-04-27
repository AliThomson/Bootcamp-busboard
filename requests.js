const request = require('request');

exports.setOptions = function(url) {
    return options = {
        uri: url,
        headers: {
            'User-Agent': 'Request-Promise'
        },
        json: true
    };
}
