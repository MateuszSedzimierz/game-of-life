const SIZE = 58;

const toSurviveParams = new Array();
const toRebornParams = new Array();

const cells = new Array(SIZE);
const nextGeneration = new Array(SIZE);

var running = null;

class Cell {
    constructor(id, isAlive) {
        this.id = id;
        this.isAlive = isAlive;
    }

    setAlive(alive) {
        const $cell = $('#' + this.id);
        
        if (alive === true) {
            $cell.addClass('alive-cell');
        } else {
            $cell.removeClass('alive-cell');
        }

        this.isAlive = alive;
    }
}

$(function() {
    createOptions();
    createBoard();

    $('#start').on('click', function(event) {
        if (running == null) {
            start();
        } else {
            stop();
        }
    });

    $('#next-step').on('click', function() {
        if (startIsPossible()) {
            makeStep();
        }
    })

    $('#clear').on('click', () => clearBoard());

    $('#random').on('click', () => randomFill());
})

function createOptions() {
    $toSurviveDiv = $('#to-survive');
    $toRebornDiv = $('#to-reborn');

    for (let i = 0; i < 9; i++) {
      createNumberButton($toSurviveDiv, i, toSurviveParams);
      createNumberButton($toRebornDiv, i, toRebornParams);  
    }
}

function createNumberButton($parent, value, array) {
    const $button = $('<button class="number-button">' + value + '</button>');

    $button.on('click', function() {
        if ($(this).hasClass('number-button-clicked')) {
            $(this).removeClass('number-button-clicked');
            removeFromArray(array, value);
        } else {
            $(this).addClass('number-button-clicked');
            array.push(value);
        }
    });
    
    $parent.append($button);
}

function removeFromArray(array, value) {
    const index = array.indexOf(value);
    if (index > -1) {
        array.splice(index, 1);
    }
}

function createBoard() {
    let $board = $('#board');

    for (let i = 0; i < SIZE; i++) {
        let $row = $('<tr>');
        cells[i] = new Array(SIZE);
        nextGeneration[i] = new Array(SIZE);
                
        for (let j = 0; j < SIZE; j++) {
            let id = 'Cell-' + i + '-' + j;
            $cell = $('<td id="' + id + '" class="cell">');
            cells[i][j] = new Cell(id, false);
 
            $cell.on('click', function() {
                if (running === null)
                    cells[i][j].setAlive(!cells[i][j].isAlive);
            });
 
            $row.append($cell);
        }

        $board.append($row);
    }   
}

function startIsPossible() {
    let $message = $('#error-message');
    
    if (toSurviveParams.length == 0 || toRebornParams.length == 0) {
        $message
            .text('Parameters cannot be empty')
            .fadeTo(1000, 1);
    } else if ($('.alive-cell').length == 0) {
        $message
            .text('Select any alive cells')
            .fadeTo(1000, 1)
    } else {
        $message.fadeTo(1000, 0);
        return true;
    }

    return false;
}

function start() {
    if (startIsPossible()) {
        $('#start').text('Stop');
        setButtonsDisabled(true);
        running = setInterval(makeStep, 1000);
    }
}

function stop() {
    if (running !== null) {
        $('#start').text('Start');
        setButtonsDisabled(false);
        clearInterval(running);
        running = null;
    }
}

function setButtonsDisabled(disabled) {
    $('#next-step').prop('disabled', disabled);
    $('#clear').prop('disabled', disabled);
    $('#random').prop('disabled', disabled);
    $('.number-button').prop('disabled', disabled);
    $('.cell').css('cursor', disabled === true ? 'default' : 'pointer');
}

function makeStep() {
    for (let i = 0; i < SIZE; i++) {
        for (let j = 0; j < SIZE; j++) {
            let neighbours = countLivingNeighbours(i, j);
            nextGeneration[i][j] = false;
            if (cells[i][j].isAlive === true) {
                if (toSurviveParams.includes(neighbours)) {
                    nextGeneration[i][j] = true;
                }
            } else if (toRebornParams.includes(neighbours)) {
                nextGeneration[i][j] = true;
            }
        }
    }
    updateCells();
}

function countLivingNeighbours(row, column) {
    let counter = 0;
    counter += testNeighbour(row - 1, column - 1);
    counter += testNeighbour(row - 1, column);
    counter += testNeighbour(row - 1, column + 1);
    counter += testNeighbour(row, column - 1);
    counter += testNeighbour(row, column + 1);
    counter += testNeighbour(row + 1, column - 1);
    counter += testNeighbour(row + 1, column);
    counter += testNeighbour(row + 1, column + 1);
    return counter;
}

function testNeighbour(x, y) {
    try {
        if (cells[x][y].isAlive === true) {
            return 1;
        }
    } catch (error) {}
    return 0;
}

function updateCells() {
    let updated = 0;
    for (let i = 0; i < SIZE; i++) {
        for (let j = 0; j < SIZE; j++) {
            let state = nextGeneration[i][j];
            if (cells[i][j].isAlive !== state) {
                cells[i][j].setAlive(state);
                updated++;
            }
        }
    }
    if (updated === 0) {
        stop();
    }
}

function clearBoard() {
    for (let i = 0; i < SIZE; i++) {
		for (let j = 0; j < SIZE; j++) {
			cells[i][j].setAlive(false);
		}
	}
}

function randomFill() {
    clearBoard();
    for (let i = 0; i < SIZE; i++) {
		for (let j = 0; j < SIZE; j++) {
            if (Math.random() >= 0.90)
                cells[i][j].setAlive(true);
		}
	}
}