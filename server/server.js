const path = require('path');
const http = require('http');
const fs = require('fs');
const express = require('express');
const socketio = require('socket.io');
const formatMessage = require('./utils/messages');
const { 
    userJoin, 
    getCurrentUser, 
    userLeave, 
    getRoomUsers,
    updateScores,
    resetScores,
    setRanks,
    getRank,
    checkNobody
} = require('./utils/users');
const {Game, updateUserScoreRank} = require('./utils/game');

global.answer = ""

const app = express();
const server = http.createServer(app);
const io = socketio(server);

// Set static folder
app.use(express.static(path.join(__dirname, '../public')));

const botname = 'domobot';

// Run when client connects
io.on('connection', socket => {
    console.log('user connected');

    socket.on('joinRoom', ({ username, room }) => {

        console.log(`${username} joined ${room}`)
        const user = userJoin(socket.id, username, room, score=0);

        socket.join(user.room)

        if (socket.id === getRoomUsers(user.room)[0].id) {
            socket.emit('showStartButton')
        }

        // Welcome current user
        socket.emit('message', formatMessage(botname,'Welcome to the game'));

        // Broadcast when a user connects
        socket.broadcast.to(user.room).emit('message', formatMessage(botname,`${user.username} has joined the game`));
        
        updateUserScoreRank(io, user)

    });

    // Listen for chatMessage
    socket.on('chatMessage', (msg) => {
        const user = getCurrentUser(socket.id);

        io.to(user.room).emit('message', formatMessage(user.username, msg));

        // if answer is right
        if (answer !== "" && answer === msg) {
            game.answered(io, user)}
        
    });

    // When Game start button clicked
    socket.on('startGame', ({rounds, roundtime}) => {
        console.log("round: ", rounds, roundtime)
        console.log(typeof(rounds), typeof(roundtime))
        const user = getCurrentUser(socket.id);

        global.game = new Game(rounds, roundtime)

        game.startGame(io, user)

        // add questions to words
        game.addQuestions()

        // run Round
        game.runRound(io, user)
        
    });

    socket.on('ready', () => {
        user = getCurrentUser(socket.id)
        console.log(socket.id, 'ready')
        game.ready.add(socket.id)
        console.log(game.ready.size)
        console.log(getRoomUsers(user.room).length)
        if (game.ready.size === getRoomUsers(user.room).length) {
            io.to(user.room).emit('play')
        }
    })

    // Runs when client disconnects
    socket.on('disconnect', () => {
        console.log('user disconnected');
        const user = userLeave(socket.id);

        if(user) {
            io.to(user.room).emit('message', formatMessage(botname,`${user.username} has left the chat`));
            updateUserScoreRank(io, user)
        
        if (checkNobody(user.room) === true) {
            console.log('delete game')
            delete game
        } else {
            io.to(getRoomUsers(user.room)[0].id).emit('showStartButton')
        }
        }
    });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
