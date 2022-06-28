import { getNewCharacter } from "./modules/character.js"

const socket = io()
let messages = document.querySelector('section ul')
let input = document.querySelector('input')
let form = document.querySelector('#chat')


socket.on('start game', () => {
    console.log('game has started')
})
socket.on('new character', (data) => {
    getNewCharacter(data)
})


form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (input.value) {
        socket.emit('message', {
            message: input.value,
            // username: username
        });
        input.value = '';
    }
});

socket.on('message', (msg) => {
    const item = document.createElement('li');
    item.textContent = `${msg.message}`;
    messages.appendChild(item);
    window.scrollTo(0, document.body.scrollHeight);
});

socket.on('connected', msg => {
    console.log(msg)
    const joinMessage = document.createElement('li');
    joinMessage.textContent = msg;
    messages.appendChild(joinMessage);


})

