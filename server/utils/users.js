const users = [];

// Join user to chat
function userJoin(id, username, room, score) {
    const user = { id, username, room, score };

    users.push(user);

    return user;
};

// Get current user
function getCurrentUser(id) {
    return users.find(user => user.id === id);
};

// User leaves chat
function userLeave(id) {
    const index = users.findIndex(user => user.id === id );
    if(index !== -1) {
        return users.splice(index, 1)[0];
    }
};

// Get room users
function getRoomUsers(room) {
    return users.filter(user => user.room === room );
};

// update user score
function updateScores(user, scoreChange) {
    var item = { id: user.id, username: user.username, room: user.room, score: user.score + scoreChange};
    var foundIndex = users.findIndex(x => x.id == item.id);
    users[foundIndex] = item;
}

function resetScores() {
    for (let i=0; i < users.length; i++) {
        users[i].score = 0
      };
}

// set or update rank
function setRanks(users) {
    var arr = []
    for (let i=0; i < users.length; i++) {
      arr.push(users[i].score)
    };
    const sorted = [...arr].sort((a, b) => b - a);
    var new_arr = arr.map((x) => sorted.indexOf(x) + 1);
    for (let i=0; i < users.length; i++) {
      users[i].rank = new_arr[i];
    };
}

// user rank
function getRank(id) {
    return users.find(c => c.id === id)['rank'];
    }

// Get current user
function getWinner(id) {
    winners = users.filter(user => user.rank === 1);
    if (winners.length === 1) {
        return winners[0].username
    } else {
        var str= ""
        for (let i = 0; i < winners.length; i++) {
            str = str + winners[i].username
        }
        return str
    }

};

function checkNobody(room) {
    if (users.filter(user => user.room === room).length === 0) {
        return true
    } else {
        return false
    }
}

module.exports = {
    userJoin,
    getCurrentUser,
    userLeave,
    getRoomUsers,
    updateScores,
    resetScores,
    setRanks,
    getRank,
    getWinner,
    checkNobody
}