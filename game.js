const SIZE = 58;

$(function() {
    let $board = $('#board');
    for (i = 0; i < SIZE; i++) {
        let $row = $('<tr>');
        for (j = 0; j < SIZE; j++) {
            $row.append(createCell(i, j));
        }
        $board.append($row);
        console.log("Appended");
    }    

    function createCell(row, column) {
        let cell = document.createElement("td");
        cell.id = "Cell_" + row + "_" + column;
        cell.className = "cell";
        return cell;
    } 
});