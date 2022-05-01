var words = []
rounds = 0

// 단어 목록
const wordpool = [
    ['대한민국', '대한민국.png'],
    ['일본', '일본.png'],
    ['미국', '미국.png']]

// get random int
function getRandomInt(n) {
    const nums = new Set();
    while(nums.size !== n) {
      nums.add(Math.floor(Math.random() * wordpool.length))
      };
    console.log([...nums]);
    return [...nums] // return array
};

// add n number of words to words
function addWords(rounds) {
    var num = getRandomInt(rounds);
    for (const x of num) {
        words.push(wordpool[x])
    }
    console.log(words);
};

function getAnswer() {
    return words[0][0]
}

function getQuestion() {
    return words[0][1]
}

function nextQuestion() {
    words.shift()
    answer = ""
}

function resetWords() {
    words = []
}

function setRounds(input) {
    rounds = input
}

function decreaseRounds() {
    rounds--
}
function getRounds() {
    return rounds
}

module.exports = {
    addWords,
    getAnswer,
    getQuestion,
    nextQuestion,
    resetWords,
    setRounds,
    decreaseRounds,
    getRounds
}