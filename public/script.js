let socket = io()
let messages = document.querySelector('section ul')
let input = document.querySelector('input')
let form = document.querySelector('#chat')
const username = new URLSearchParams(window.location.search).get('name')
// console.log(username)



//submit msg username
if (window.location.pathname === '/') {
    let usernameForm = document.querySelector('#username-form')
    usernameForm.addEventListener('submit', () => {
        usernameForm.submit()
    })

}

if (window.location.pathname === '/chat') {


    form.addEventListener('submit', (event) => {
        event.preventDefault();
        if (input.value) {
            socket.emit('message', {
                message: input.value,
                username: username
            });
            input.value = '';
        }
    });

    socket.on('message', (msg) => {
        const item = document.createElement('li');
        item.textContent = `${msg.username}: ${msg.message}`;
        messages.appendChild(item);
        window.scrollTo(0, document.body.scrollHeight);
    });

    socket.on('connected', msg => {
        console.log(msg)
        const joinMessage = document.createElement('li');
        joinMessage.textContent = msg;
        messages.appendChild(joinMessage);


    })

}





