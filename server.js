/*
https://socket.io/get-started/chat
*/

const express = require('express');

const app = express();
const http = require('http').createServer(app);
const path = require('path');
const io = require('socket.io')(http);
const port = process.env.PORT || 4242
const getData = require('./util/getData.js')


// set templating engine
app.set('view engine', 'ejs');
//w here the templates are stored
app.set('views', 'view');
app.use(express.static(path.resolve('public')))
app.use(express.text());
app.use(express.urlencoded({ extended: false }));
app.get('/', getData)



// function chat(req, res) {
//     const username = req.query.name
//     //  console.log(req.query.name)
//     // console.log(res)
//     res.render('chat', { username })
// }


io.on('connection', (socket) => {
    console.log(` a user connected`)
    io.emit('connected', 'a  user has connected');


    // socket.on('send-username', (username) => {
    //     console.log(socket.username)
    //     socket.username = username;
    // });


    socket.on('message', (message) => {
        io.emit('message', message)
    })

    socket.on('disconnect', () => {
        console.log('user disconnected')
    })
})

http.listen(port, () => {
    console.log('listening on port ', port)
})

