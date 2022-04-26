const fetch = require('cross-fetch');
const crypto = require('crypto')
require('dotenv').config()

// fetch data
async function fetchData(req, res) {

    try {
        const API_KEY = process.env.API_KEY;
        const PRIV_KEY = process.env.PRIV_KEY;
        var url = "http://gateway.marvel.com/v1/public/characters?orderBy=-modified&limit=100?" + "&apikey=" + API_KEY;
        var ts = new Date().getTime();
        var hash = crypto.createHash('md5').update(ts + PRIV_KEY + API_KEY).digest('hex');
        url += "&ts=" + ts + "&hash=" + hash;

        const data = await fetch(url)
        const response = await data.json()
        const array = response.data.results

        const randomElement = array[Math.floor(Math.random() * array.length)];
        console.log(randomElement)
       // const username = req.query.name

        res.render('index', { data: randomElement })
    }
    catch (err) {
        console.log(err)

    }
}

module.exports = fetchData;

// bron: https://www.raymondcamden.com/2014/02/02/Examples-of-the-Marvel-API