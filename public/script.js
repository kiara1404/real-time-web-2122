import { getNewCharacter } from "./modules/character.js"

const socket = io()
let messages = document.querySelector('section ul')
let form = document.querySelector('#chat')
let gamePage = document.querySelector('.game')
const answerInput = document.querySelector('#answerInput')



if (gamePage) {
    // when user connects, show message
    socket.on('user connect', userName => {
        if (userName) {
            console.log(userName)
            const item = document.createElement('li');
            item.classList.add('joined-msg')
            item.textContent = `${userName} has joined!`;
            messages.appendChild(item);


        }

    })



    socket.on('new character', (data) => {
        getNewCharacter(data)
    })



    socket.on('message', (msg) => {
        const item = document.createElement('li');
        item.textContent = `${msg.message}`;
        messages.appendChild(item);
        window.scrollTo(0, document.body.scrollHeight);
    });


    //check if there's an input > emit answer
    form.addEventListener('submit', (event) => {
        event.preventDefault();
        if (answerInput.value) {
            socket.emit('message', {
                message: answerInput.value,
                // username: username
            });
            socket.emit('answer', answerInput.value)
            answerInput.value = '';

        }
    });


    //Show message if answer is correct
    socket.on('good answer', (msg) => {
        const item = document.createElement('li');
        item.classList.add('good-answer')
        item.textContent = 'Het antwoord is geraden! Het antwoord is ' + msg.toString()
        messages.appendChild(item);
        window.scrollTo(0, document.body.scrollHeight);

    })
}
