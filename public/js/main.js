const chatForm = document.getElementById('formChat');
const chatMessages = document.getElementById('boxMessages');
const roomName = document.getElementById('roomName');
const userList = document.getElementById('containerGamePlayers').getElementsByClassName('name');

console.log(userList);
// // Get username and room from URL qs cdn
const { username, room } = Qs.parse(location.search.slice(1), {
    ignoreQueryPrefix: true
});

const socket = io();

// Join chatroom
console.log('joined Room');
socket.emit('joinRoom', { username, room });

// Get room and users
socket.on('roomUsers', ({ room, users }) => {
    outputRoomname(room);
    outputUsers(users);
})

// Message from server
socket.on('message', message => {
    outputMessage(message);

    // Scroll down
    chatMessages.scrollTop = chatMessages.scrollHeight;
})

// Message submit
chatForm.addEventListener('submit', e => {
    e.preventDefault();

    // Get message text
    const msg = e.target.elements.inputChat.value;

    // Emit message to server
    socket.emit('chatMessage', msg);

    // Clear input
    e.target.elements.inputChat.value = '';
    e.target.elements.inputChat.focus();
});

// Output message to DOM
function outputMessage(message) {
    const p = document.createElement('p');
    p.classList.add('message');
    p.innerHTML = `<b>${message.username}: </b><span>${message.text}</span>`;
    document.getElementById('boxMessages').appendChild(p);
}

// Add room name to DOM
function outputRoomname(room) {
    roomName.innerText = room;
}

// Add users to DOM
function outputUsers(users) {
    document.getElementById('containerGamePlayers')
        .innerHTML = `
        ${users.map(user => `
        <div class="player" id=${user.id}>
          <div class="rank">2</div>
          <div class="info">
            <div class="name">${user.username}</div>
            <div class="score">2000</div>
          </div>
          <div class="avatar"></div>
        </div>`).join('')}
    `;
}