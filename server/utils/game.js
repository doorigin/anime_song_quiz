const fs = require('fs');
const path = require('path');
const formatMessage = require('./messages');
const { 
    userJoin, 
    getCurrentUser, 
    userLeave, 
    getRoomUsers,
    updateScores,
    resetScores,
    setRanks,
    getRank,
    getWinner
} = require('./users');
botname = "domobot"
var countdown = 0
answer = 0

words = [
    ['소아온', 'https://staging.animethemes.moe/video/SwordArtOnline-ED1.webm'],
    ['모노가타리', 'https://staging.animethemes.moe/video/MonogatariSS-OP1.webm'],
    ['데어라', 'https://staging.animethemes.moe/video/DateALive-ED1.webm'],
    ['카구야','https://staging.animethemes.moe/video/KaguyaSamaWaKokurasetai-ED1.webm'],
    ['페스나','https://staging.animethemes.moe/video/FateStayNightOVA-ED1.webm'],
    ['페그오','https://staging.animethemes.moe/video/FateGrandOrderBabylonia-ED1.webm'],
    ['바이올렛','https://staging.animethemes.moe/video/VioletEvergarden-ED1.webm']
]

var updateUserScoreRank = (io, user) => {
    // Set player rank
    setRanks(getRoomUsers(user.room))

    // Send users and room info
    io.to(user.room).emit('roomUsers', {
        room: user.room,
        users: getRoomUsers(user.room)
    })
}

class Game {
    constructor(totalRounds, roundTime) {
        this.totalRounds = totalRounds
        this.round = 1
        this.roundTime = roundTime
    }

    questionpool = words;
    questions = [];
    state = true;
    ready = new Set();
    counter = 90

    startGame = (io, user) => {
        io.to(user.room).emit(
            'message', 
            formatMessage(botname,`${user.username} has pressed game start`)
            );

        // reset scores
        resetScores()

        // Set player rank
        setRanks(getRoomUsers(user.room))

        // Send users and room info
        io.to(user.room).emit('roomUsers', {
            room: user.room,
            users: getRoomUsers(user.room)
        })

        // Send users round info
        io.to(user.room).emit('roundInfo', {
            currentRound: this.round,
            totalRounds: this.totalRounds
        })
    }

    // add n questions [answer, image]
    addQuestions = () => {
        const nums = new Set();
        while(nums.size !== this.totalRounds) {
        nums.add(Math.floor(Math.random() * this.questionpool.length))
        };
        for (const x of [...nums]) {
            this.questions.push(this.questionpool[x])
        }
        console.log("Added questions")
        console.log(this.questions)
    }

    runRound = (io, user) => {
        this.counter = this.roundTime

        // Send users round info
        io.to(user.room).emit('roundInfo', {
            currentRound: this.round,
            totalRounds: this.totalRounds
        })
            
        // change answer
        answer = this.questions[0][0];

        // countdown on
        countdown = setInterval(() => {
            io.to(user.room).emit('counter', this.counter);
            console.log(this.counter)
            this.counter--;
            if (this.counter===-1) {
                this.counter = this.roundTime
                this.timeUp(io, user);
            }
        }, 1000);

        // clear canvas
        io.to(user.room).emit('video', {video: false, src: this.questions[0][1], id: this.round});

        // send question video
        io.to(user.room).emit('video', { video: true, src: this.questions[0][1], id: this.round});
        console.log(this.questions[0][1])
    }

    answered = (io, user) => {
        io.to(user.room).emit('message', formatMessage(botname, `${user.username} right answer`));

        answer = "";
        this.counter = this.roundTime

        // clear countdown
        clearInterval(countdown);

        // add round
        this.round++;

        // ready = 0
        this.ready.clear()

        // update scores and rank
        updateScores(user, 10);
        updateUserScoreRank(io, user);

        // run next round if round left
        if (this.round < this.totalRounds+1) {
            this.questions.shift();
            this.runRound(io, user);
        } else {
            this.endGame(io, user)
        }
    }

    timeUp = (io, user) => {
        io.emit('message', formatMessage(botname, `Time is up! The answer was ${answer}`));

        answer = "";

        // clear countdown
        clearInterval(countdown);

        // add round
        this.round++;

        // ready = 0
        this.ready.clear()
        
        // some Interval

        // run next round if round left
        if (this.round < this.totalRounds+1) {
            this.questions.shift();
            this.runRound(io, user);
        } else {
            this.endGame(io, user)
        }
    }

    endGame(io, user) {
        console.log('game end')
        io.to(user.room).emit('message', formatMessage(botname, `Game Over`));
        io.to(user.room).emit('message', formatMessage(botname, `Winner is ${getWinner()}`));
    }

}

module.exports = {Game, updateUserScoreRank}