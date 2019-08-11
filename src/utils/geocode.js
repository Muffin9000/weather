const request = require('request');

const argument = process.argv[2];

const geocode = (address, callback) => {
    if (argument) {
        address = argument;
    }
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json?access_token=pk.eyJ1IjoibWFwYm9paWkiLCJhIjoiY2p6NGpoNWlzMDJnYTNvdDRnbjJlYXl2aSJ9.rAlXZL2CtcLSzFyOYiNHzw&limit=1`;
    request({
        url,
        json: true
    }, (error, {body} = {}) => {
        if (error) {
            callback('Unable to connect', undefined);
        } else if (body.message) {
            callback(undefined, body.message);
        } else {
            if (body.features.length > 0) {
                const {place_name:place,geometry} = body.features[0];
                const coordinates = geometry.coordinates;
                const data = {place,coordinates}
                callback(undefined, data);
            } else {
                callback('Could not find coordinates of ' + address, undefined);
            }
        }
    })
}

const forecast = (coordinates, language, callback) => {
    const url = `https://api.darksky.net/forecast/3873d1987f39868177aa6ed8502f7e55/${coordinates[1]},${coordinates[0]}?units=si&lang=${language}`;

    request({
        url,
        json: true
    }, (err, {body} = {}) => {
        if (err) {
            callback(err, undefined);
        } else if (body.code) {
            callback(undefined, body.error);
        } else {
            const {timezone, daily, currently} = body
            const summary = daily.data[0].summary;
            const temperature = currently.temperature;
            const text = `The wind speed is ${currently.windSpeed} km/h`;
            callback(undefined, body)
        }
    })
}

module.exports = {geocode,forecast};