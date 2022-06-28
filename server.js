
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

// set templating engine
app.set('view engine', 'ejs');
//w here the templates are stored
app.set('views', 'view');
app.use(express.static(path.resolve('public')))
app.use(express.text());
app.use(express.urlencoded({ extended: false }));
app.get('/', (req, res) => {
    res.render('login', {randomElement})
})
app.post('/', (req, res) => {
    const userName = req.query.userName;
    res.render('index', { userName })
})

 let randomElement;

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

        const randomizeData = () => {
            const randomCharacter = array[Math.floor(Math.random() * array.length)];
            return randomCharacter
        }
        randomElement = randomizeData()
    }
    catch (err) {
        console.log(err)

    }
}


getData();

let users = [];
let round = 0;

io.on('connection', (socket) => {
    console.log(` a user connected`)
    io.emit('connected', 'a  user has connected');

    // let characterData = {
    //     name: randomElement.name,
    //     url: randomElement.thumbnail.path + '/portrait_incredible.' + randomElement.thumbnail.extension
    // }
    if(randomElement){
        let characterData = {
            name: randomElement.name,
            url: randomElement.thumbnail.path + '/portrait_incredible.' + randomElement.thumbnail.extension
        }
        io.emit('new character', characterData)
    }


    socket.on('new client', (userName) => {
        io.emit('new client', userName);
        // storing user data to acces when someone disconnects
        users.push({
            username: userName,
            // each client has their own socket.id
            // I store this with the name, so I know who is leaving
            id: socket.id
        });

    })
    socket.on('message', (message) => {
        io.emit('message', message)
    })

    socket.on('disconnect', () => {
        console.log('user disconnected')
    })
})

io.emit()

server.listen(port, () => {
    console.log('listening on port ', port)
})

