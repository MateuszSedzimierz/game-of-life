const SIZE = 58;

const toSurviveParams = new Array();
const toRebornParams = new Array();

const cellIds = new Array(SIZE);
const states = new Array(SIZE);
const nextStates = new Array(SIZE);

var aliveCells = 0;
var running = null;
var speed = 700;

document.addEventListener('DOMContentLoaded', function() {
    addParameterButtons();
    addBoard();

    document.getElementById('start').addEventListener('click', () => {
        if (running) {
            stop();
        } else {
            start();
        }
    });

    document.getElementById('next-step').addEventListener('click', () => {
        if (isReadyToStart()) {
            step();
        }
    });

    document.getElementById('speed').addEventListener('input', function() {
        refreshSpeed(this.value);
    });

    document.getElementById('clear').addEventListener('click', () => {
        clearBoard();
    });

    document.getElementById('random').addEventListener('click', () => {
        randomFill();
    });
});

function addParameterButtons() {
    let toSurvive = document.getElementById('to-survive');
    let toReborn = document.getElementById('to-reborn');

    for (let i = 0; i <= 8; i++) {
        createNumberButton(toSurvive, i, toSurviveParams);
        createNumberButton(toReborn, i, toRebornParams);
    }
}

function createNumberButton(parent, value, array) {
    let button = document.createElement('button');
    button.innerHTML = value;
    button.classList.add('number-button');
    button.addEventListener('click', function() {
        if (array.includes(value)) {
            this.classList.remove('number-button-clicked');
            removeFromArray(array, value);
        } else {
            this.classList.add('number-button-clicked');
            array.push(value);
        }
    })
    parent.appendChild(button);
}

function removeFromArray(array, value) {
    const index = array.indexOf(value);
    if (index > -1) {
        array.splice(index, 1);
    }
}

function addBoard() {
    const board = document.getElementById('board');
    for (let i = 0; i < SIZE; i++) {
        cellIds[i] = new Array(SIZE);
        states[i] = new Array(SIZE);
        nextStates[i] = new Array(SIZE);

        let row = document.createElement('tr');
        for (let j = 0; j < SIZE; j++) {
            let id = 'cell-' + i + '-' + j;
            let cell = document.createElement('td');
            cell.id = id;
            cell.classList.add('cell');
            cell.addEventListener('click', function() {
                if (running === null) {
                    changeState(i, j);
                }
            })
            cellIds[i][j] = id;
            states[i][j] = 0;
            row.appendChild(cell);
        }
        board.appendChild(row);
    }
}

function changeState(row, column) {
    let cell = document.getElementById(cellIds[row][column]); 
    if (states[row][column] === 1) {
        cell.classList.remove('alive-cell');
        states[row][column] = 0;
        aliveCells--;
    } else {
        cell.classList.add('alive-cell');
        states[row][column] = 1;
        aliveCells++;
    }
}

function isReadyToStart() {
    let message = document.getElementById('error-message');
    if (!toSurviveParams.length || !toRebornParams.length) {
        message.innerHTML = 'Parameters cannot be empty';
    } else if (aliveCells === 0) {
        message.innerHTML = 'Select any alive cells';
    } else {
        let opacity = 1;
        let fadeOut = setInterval(() => {
            if (opacity >= 0) {
                message.style.opacity = opacity;
                opacity -= 0.05;
            } else {
                clearInterval(fadeOut);
            }
        }, 50);
        message.innerHTML = '';
        return true;
    }
    
    message.style.opacity = 1;
    return false;
}

function start() {
    if (isReadyToStart()) {
        document.getElementById('start').innerHTML = 'Stop';
        setButtonsDisabled(true);
        running = setInterval(step, speed);
    }
}

function setButtonsDisabled(disabled) {
    document.getElementById('next-step').disabled = disabled;
    document.getElementById('clear').disabled = disabled;
    document.getElementById('random').disabled = disabled;
    document.getElementById('board').disabled = disabled;

    const numberButtons = document.querySelectorAll('.number-button');
    for (let i = 0; i < numberButtons.length; i++) {
        numberButtons[i].disabled = disabled;
    }
}

function stop() {
    document.getElementById('start').innerHTML = 'Start';
    setButtonsDisabled(false);
    clearInterval(running);
    running = null;
}

function step() {
    for (let i = 0; i < SIZE; i++) {
        for (let j = 0; j < SIZE; j++) {
            nextStates[i][j] = 0;
            let aliveAround = countAliveAround(i, j);
            if (states[i][j] === 1) {
                if (toSurviveParams.includes(aliveAround)) {
                    nextStates[i][j] = 1;
                }
            } else if (toRebornParams.includes(aliveAround)) {
                nextStates[i][j] = 1;
            }
        }
    }
    updateCells();
}

function countAliveAround(row, column) {
    let alive = 0;
    alive += testCell(row - 1, column - 1);
    alive += testCell(row - 1, column);
    alive += testCell(row - 1, column + 1);
    alive += testCell(row, column - 1);
    alive += testCell(row, column + 1);
    alive += testCell(row + 1, column - 1);
    alive += testCell(row + 1, column);
    alive += testCell(row + 1, column + 1);
    return alive;
}

function testCell(x, y) {
    try {
        return states[x][y];
    } catch(error) {
        return 0;
    }
}

function updateCells() {
    let updated = 0;
    for (let i = 0; i < SIZE; i++) {
        for (let j = 0; j < SIZE; j++) {
            if (states[i][j] != nextStates[i][j]) {
                changeState(i, j);
                updated++;
            }
        }
    }

    if (updated === 0 || aliveCells === 0) {
        stop();
    }
}

function refreshSpeed(value) {
    speed = value * -1;
    if (running) {
        clearInterval(running);
        running = setInterval(step, speed);
    }
}

function clearBoard() {
    for (let i = 0; i < SIZE; i++) {
        for (let j = 0; j < SIZE; j++) {
            if (states[i][j] === 1) {
                changeState(i, j);
            }
        }
    }
}

function randomFill() {
    clearBoard();
    for (let i = 0; i < SIZE; i++) {
        for (let j = 0; j < SIZE; j++) {
            if (Math.random() >= 0.9) {
                changeState(i, j)
            }
        }
    }
}