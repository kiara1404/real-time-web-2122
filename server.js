
import express from 'express';
import { Server } from 'socket.io';
import { createServer } from 'http';
import path from 'path';
import crypto from 'crypto';
import 'dotenv/config';
import fetch from 'cross-fetch';

const app = express()
const port = process.env.PORT || 4242
const server = createServer(app)
export const io = new Server(server)

let username;
// set templating engine
app.set('view engine', 'ejs');
//w here the templates are stored
app.set('views', 'view');
app.use(express.static(path.resolve('public')))
app.use(express.text());
app.use(express.urlencoded({ extended: false }));
app.get('/', (req, res) => {
    res.render('login', { randomElement })
})
app.get('/game', (req, res) => {
    username = req.query.userName;
    // console.log(userName)
    res.render('index', { username })
})

// global variables
let characterData;
let randomElement;
let users = [];
let game = 0;

// array with characters that are well known
const characters = ['Thor', 'Punisher', 'Daredevil', 'Hulk', 'Deadpool', 'Captain America', 'Doctor Strange']

// get Data function
const getData = async () => {

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

        // filter data 
        let newArray = array.filter(array => {
            return characters.includes(array.name)
        })

        //randomize array
        const sortingData = newArray.sort(() => .5 - Math.random())
        console.log(sortingData.length)

        randomElement = sortingData
    }
    catch (err) {
        console.log(err)

    }
}

// setup data
getData()
    .then(() => console.log('Loading the data..', randomElement[game].name))
    .then(() => {
        characterData = {
            name: randomElement[game].name,
            url: randomElement[game].thumbnail.path + '/portrait_incredible.' + randomElement[game].thumbnail.extension
        }
    })
    .catch((err) => console.log(err))




// setting up socket connection
io.on('connection', (socket) => {

    socket.on('user connect', (userName) => {
        io.emit('user connect', { username })
        console.log(username)
    });

    users.push({
        username: username
    });
    // global variable for connecting name
    io.emit('user connect', (username));
    console.log('user connected')

    // emmitting filtered data from api
    io.emit('new character', characterData)

    // answer
    socket.on('answer', (answer) => {
        const characterName = characterData.name;
        const goodAnswer = characterData.name.toLowerCase();
        const guess = answer.toLowerCase();

        // if answer is correct
        if (guess.includes(goodAnswer)) {
            io.emit('good answer', characterName);

            // for next character if answer is correct
            if (game >= randomElement.length - 1) {
                game = 0;
                getData()
                    .then(() => console.log('round has ended'))
            } else {
                game = game + 1
            }
            characterData = {
                name: randomElement[game].name,
                url: randomElement[game].thumbnail.path + '/portrait_incredible.' + randomElement[game].thumbnail.extension
            }
            // call for next character 
            io.emit('new character', characterData)
            console.log('good answer', game)
        }
    });


    // setup for messages
    socket.on('message', (message) => {
        io.emit('message', message)
    })

    socket.on('disconnect', () => {
        io.emit('user left', { username })
        console.log(username)
        users.splice(username)
    });

})

io.emit()

server.listen(port, () => {
    console.log('listening on port ', port)
})

