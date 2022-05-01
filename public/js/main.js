const chatForm = document.getElementById('formChat');
const chatMessages = document.getElementById('boxMessages');
const roomName = document.getElementById('roomName');
const userList = document.getElementById('containerGamePlayers').getElementsByClassName('name');
const startGameButton = document.getElementById("startGameButton");
const timer = document.getElementById("timer");
const roundTab = document.getElementById("round");

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

// Get round info
socket.on('roundInfo', ({ currentRound, totalRounds }) => {
    outputRoundInfo(currentRound, totalRounds)
})

// Message from server
socket.on('message', message => {
    outputMessage(message);

    // Scroll down
    chatMessages.scrollTop = chatMessages.scrollHeight;
})

// Get timer counter
socket.on('counter', count => {
    console.log('counter start')
    outputTimer(count);
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
    
    if (message.username === "domobot") {
        p.style.cssText = "color: rgb(150, 30, 200); font-weight: bold;";
        p.innerHTML = `<span>${message.text}</span>`;
    } else {
        p.innerHTML = `<b>${message.username}: </b><span>${message.text}</span>`;
    }

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
          <div class="rank">${user.rank}</div>
          <div class="info">
            <div class="name">${user.username}</div>
            <div class="score">${user.score}</div>
          </div>
          <div class="avatar"></div>
        </div>`).join('')}
    `;
}

function outputRoundInfo(currentRound, totalRounds) {
    roundTab.innerHTML = `Round ${currentRound} of ${totalRounds}`
}

// Output timer count to DOM
function outputTimer(count) {
    timer.innerHTML = count
}

// When click game start button
startGameButton.addEventListener('click', e => {
    e.preventDefault();

    // Emit message to server
    socket.emit('startGame');
})

// Listen to Show question
socket.on('showQuestion', image => {
    console.log('show image', image)
})

var canvas = document.getElementById("canvasGame");
var ctx = canvas.getContext('2d');
// Listen to image
socket.on('image', function(info) {
    if (info.image) {
        console.log("image");
        var img = new Image();
        img.src = 'data:image/png;base64,' + info.buffer;
        img.onload = function () {
            ctx.drawImage(img, 0, 0);
        };
    } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        console.log("no image");
    }
})
