const request = require('request');

exports.getResponse = async function (url) {
    return new Promise((resolve, reject) => {
        request(url, function(error, response, body) {
            if (error) {
                console.error('error:', error);
                console.log('statusCode:', response && response.statusCode);
                reject(error)
            } else {
                resolve(JSON.parse(body))
            }
        });
    })
}
