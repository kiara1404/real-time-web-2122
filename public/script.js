import { getNewCharacter } from "./modules/character.js"

const socket = io()
let messages = document.querySelector('section ul')
let input = document.querySelector('input')
let form = document.querySelector('#chat')
const users = document.querySelector('.users > ul ')
let nameInput = document.querySelector('#name')
const answerInput = document.querySelector('#answerInput')

//If new user, loop through the users array and display them
socket.on('user connect', user => {
    console.log(users)
    users.innerHTML = ''
    user.map((user) => {
        users.appendChild(Object.assign(document.createElement('li'), { textContent: user + ' has joined! 🥳' }))
    })
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

socket.on('user connect', msg => {
    console.log(msg)
    const joinMessage = document.createElement('li');
    joinMessage.textContent = msg;
    messages.appendChild(joinMessage);


})
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


//Show alert if answer is correct
socket.on('good answer', (msg) => {
    const item = document.createElement('li');
    item.textContent = 'Het antwoord is geraden! Het antwoord is ' + msg.toString()
    messages.appendChild(item);
    window.scrollTo(0, document.body.scrollHeight);

})