const SIZE = 58;

const toSurviveParams = new Array();
const toRebornParams = new Array();

const cells = new Array(SIZE);
var aliveCells = 0;

class Cell {
    constructor(id, isAlive) {
        this.id = id;
        this.isAlive = isAlive;
    }

    setAlive(alive) {
        const $cell = $('#' + this.id);
        
        if (alive === true) {
            $cell.addClass('alive-cell');
            aliveCells++;
        } else {
            $cell.removeClass('alive-cell');
            aliveCells--;
        }

        this.isAlive = alive;
    }
}

$(function() {
    createOptions();
    createBoard();

    $('#start').on('click', function() {
        startIsPossible();
    });

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
    const $board = $('#board');

    for (let i = 0; i < SIZE; i++) {
        const $row = $('<tr>');
        cells[i] = new Array(SIZE);
        
        for (let j = 0; j < SIZE; j++) {
            const id = 'Cell-' + i + '-' + j;
            $cell = $('<td id="' + id + '" class="cell">');
            cells[i][j] = new Cell(id, false);
 
            $cell.on('click', function() {
                cells[i][j].setAlive(!cells[i][j].isAlive);
            });
 
            $row.append($cell);
        }

        $board.append($row);
    }   
}

function startIsPossible() {
    const $message = $('#error-message');
    
    if (toSurviveParams.length == 0 || toRebornParams.length == 0) {
        $message
            .text('Parameters cannot be empty')
            .fadeTo(1000, 1);
    } else if (aliveCells == 0) {
        $message
            .text('Select any alive cells')
            .fadeTo(1000, 1)
    } else {
        $message.fadeTo(1000, 0);
        return true;
    }

    return false;
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