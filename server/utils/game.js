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
    getRank
} = require('./users');
botname = "domobot"
var countdown = 0
answer = 0

words = [
    ['대한민국', '대한민국.png'],
    ['일본', '일본.png'],
    ['미국', '미국.png'],
    ['영국','영국.png'],
    ['인도','인도.png'],
    ['독일','독일.png'],
    ['캐나다','캐나다.png'],
    ['태국','태국.png']
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
    constructor(totalRounds) {
        this.totalRounds = totalRounds
        this.round = 1
    }

    questionpool = words
    questions = []
    state = true
    counter = 20

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
        console.log(`round: ${this.round}`)

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
                this.counter = 20
                this.timeUp(io, user);
            }
        }, 1000);

        // clear canvas
        io.to(user.room).emit('image', {image: false, buffer: false});

        // show question image
        fs.readFile(path.join(__dirname, '../../public/img', game.questions[0][1]), function(err, buf){
            io.to(user.room).emit('image', { image: true, buffer: buf.toString('base64') });
        });
    }

    answered = (io, user) => {
        io.to(user.room).emit('message', formatMessage(botname, `${user.username} right answer`));

        answer = "";
        this.counter = 20

        // clear countdown
        clearInterval(countdown);

        // add round
        this.round++;

        // update scores and rank
        updateScores(user, 10);
        updateUserScoreRank(io, user);

        // run next round if round left
        if (this.round < this.totalRounds+1) {
            this.questions.shift();
            this.runRound(io, user);
        } else {
            this.endGame()
        }
    }

    timeUp = (io, user) => {
        io.emit('message', formatMessage(botname, `Time is up! The answer was ${answer}`));

        answer = "";

        // clear countdown
        clearInterval(countdown);

        // add round
        this.round++;
        
        // some Interval

        // run next round if round left
        if (this.round < this.totalRounds+1) {
            this.questions.shift();
            this.runRound(io, user);
        } else {
            this.endGame()
        }
    }

    endGame(io, user) {
        console.log('game end')
        io.to(user.room).emit('message', formatMessage(botname, `Game Over`));
    }

}

module.exports = {Game, updateUserScoreRank}