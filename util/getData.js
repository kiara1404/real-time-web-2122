const fetch = require('cross-fetch');
const crypto = require('crypto')
const md5 = require('md5')
require('dotenv').config()
// fetch data
async function fetchData(req, res) {

    try {
        const API_KEY = 'e253827630b72af9866ff148e718beea';
        const PRIV_KEY = '4353ef187fe33ac8123d469de4e4e31ced33a283'
        var url = "http://gateway.marvel.com/v1/public/comics?" + "&apikey=" + API_KEY;
        var ts = new Date().getTime();
        var hash = crypto.createHash('md5').update(ts + PRIV_KEY + API_KEY).digest('hex');
        url += "&ts=" + ts + "&hash=" + hash;

        const data = await fetch(url)
        const response = await data.json()
        const result = response.data.results
        console.log(result)
        res.render('index', { data: result })
    }
    catch (err) {
        console.log(err)

    }
}

module.exports = fetchData;