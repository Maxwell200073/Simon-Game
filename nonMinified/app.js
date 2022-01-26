let sequence = [];
let playerSequence = [];
let colors = ["green", "red", "yellow", "blue"];
let playId;
let level = 0;
let playerTurn = false;

// Audio
let green = new Audio("https://s3.amazonaws.com/freecodecamp/simonSound1.mp3");
let red = new Audio("https://s3.amazonaws.com/freecodecamp/simonSound2.mp3");
let yellow = new Audio("https://s3.amazonaws.com/freecodecamp/simonSound3.mp3");
let blue = new Audio("https://s3.amazonaws.com/freecodecamp/simonSound4.mp3");
let error = new Audio(
    "https://s3.amazonaws.com/adam-recvlohe-sounds/error.wav"
);

let sounds = {
    0: green,
    1: red,
    2: yellow,
    3: blue,
};

let startButton = document.querySelector("button");
let score = document.getElementById("score");
score.classList.add("animate__animated");
let power = false;

function reset() {
    playerTurn = false;
    level = 0;
    sequence = [];
    playerSequence = [];
}
function resetLights() {
    document.querySelectorAll(".colors").forEach((el) => {
        if (!el.classList.contains("active")) {
            el.classList.toggle("active");
        }
    });
}
startButton.addEventListener("click", () => {
    reset();
    power = !power;
    if (power) {
        score.classList.remove("animate__zoomOut");
        score.classList.add("animate__zoomIn");
        startGame();
    }
    if (!power) {
        resetLights();
        score.classList.remove("animate__zoomIn");
        score.textContent = "GOODBYE";
        setTimeout(() => score.classList.add("animate__zoomOut"), 1000);
        setTimeout(() => {
            score.textContent = "";
        }, 2000);
    }
});
document.querySelectorAll(".colors").forEach((el) => {
    el.addEventListener("click", checkPlayersSequence);
});

function randomNumber() {
    return Math.floor(Math.random() * 4);
}

function addNext() {
    let nextSound = randomNumber();
    sequence.push(nextSound);
}

function playThruSequence() {
    for (let i = 0; i < sequence.length; i++) {
        setTimeout(() => {
            let audio = sequence[i];
            sounds[audio].play();
            document
                .getElementById(`${colors[audio]}`)
                .classList.toggle("active");
            if (i == sequence.length - 1) {
                setTimeout(() => (playerTurn = true), 750);
            }
        }, 700 * (i + 1));

        setTimeout(() => {
            document
                .getElementById(`${colors[sequence[i]]}`)
                .classList.toggle("active");
        }, 700 * (i + 1) + 400);
    }
}

function gameOver() {
    error.play();
    reset();
    setTimeout(() => startGame, 1000);
}

function checkPlayersSequence() {
    if (power && playerTurn) {
        if (colors.indexOf(this.id) > -1) {
            this.classList.toggle("active");
            setTimeout(() => this.classList.toggle("active"), 200);
            let playerGuess = colors.indexOf(this.id);
            if (playerGuess == sequence[level]) {
                playerSequence.push(playerGuess);
                sounds[playerGuess].play();
                level++;
            } else {
                gameOver();
            }
            if (playerSequence.length == sequence.length) {
                playerTurn = false;
                playerSequence = [];
                level = 0;
                startGame();
            }
        }
    }
}

function startGame() {
    power = true;
    score.textContent = sequence.length;
    setTimeout(() => {
        addNext();
        playThruSequence();
        checkPlayersSequence();
    }, 1000);
}
