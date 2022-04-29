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
    updateScore,
    setRanks,
    getRank
} = require('./utils/users');
const {
    addWords,
    getAnswer,
    getQuestion,
    nextQuestion,
    resetWords
} = require('./utils/question')

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
        socket.emit('message', formatMessage(botname,'Welcome to the chat room'));

        // Broadcast when a user connects
        socket.broadcast
          .to(user.room)
          .emit(
              'message', 
              formatMessage(botname,`${user.username} has joined the chat`)
              );
        
        // Set player rank
        setRanks(getRoomUsers(user.room))

        // Send users and room info
        io.to(user.room).emit('roomUsers', {
            room: user.room,
            users: getRoomUsers(user.room)
        })
    });

    // Listen for chatMessage
    socket.on('chatMessage', (msg) => {
        const user = getCurrentUser(socket.id);
        console.log(user)
        console.log(answer);

        // if answer is right
        if (answer !== "" && answer === msg) {
            io.to(user.room).emit('message', formatMessage(user.username, msg))
            io.to(user.room).emit('message', formatMessage(botname, `${user.username} right answer`));
            nextQuestion();
            updateScore(user, 10);
            // update player rank
            setRanks(getRoomUsers(user.room))
            // Update player score to client
            io.to(user.room).emit('roomUsers', {
                room: user.room,
                users: getRoomUsers(user.room)
            });
        } else {
            io.to(user.room).emit('message', formatMessage(user.username, msg));
        }
    });
    
    // When Game start button clicked
    socket.on('startGame', () => {
        const user = getCurrentUser(socket.id);
        io.to(user.room).emit(
              'message', 
              formatMessage(botname,`${user.username} has pressed game start`)
              );
        
        // add questions to words
        addWords(2)
        
        // clear canvas
        io.to(user.room).emit('image', {image: false, buffer: false});

        // show question image
        fs.readFile(path.join(__dirname, '../public/img', getQuestion()), function(err, buf){
            if (err) throw err;

            io.to(user.room).emit('image', { image: true, buffer: buf.toString('base64') });
            console.log('image file is initialized');
        });
        answer = getAnswer()
    });


    // Runs when client disconnects
    socket.on('disconnect', () => {
        const user = userLeave(socket.id);

        if(user) {
            io.to(user.room).emit('message', formatMessage(botname,`${user.username} has left the chat`));

            // Send users and room info
            io.to(user.room).emit('roomUsers', {
                room: user.room,
                users: getRoomUsers(user.room)
            })
        }
    });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
