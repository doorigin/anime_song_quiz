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
    getRank
} = require('./utils/users');
const {
    addWords,
    getAnswer,
    getQuestion,
    nextQuestion,
    resetWords,
    setRounds,
    decreaseRounds,
    getRounds
} = require('./utils/question');
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
    socket.on('startGame', () => {
        const user = getCurrentUser(socket.id);

        var round = 5
        global.game = new Game(round)

        game.startGame(io, user)

        // add questions to words
        game.addQuestions()

        // run Round
        game.runRound(io, user)
        
    });


    // Runs when client disconnects
    socket.on('disconnect', () => {
        const user = userLeave(socket.id);

        if(user) {
            io.to(user.room).emit('message', formatMessage(botname,`${user.username} has left the chat`));
            updateUserScoreRank(io, user)
        }
    });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
