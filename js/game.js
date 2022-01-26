'use strict'

// משתנים גלובליים

const MINE = '💥'
const FLAG = '🚩'

var gGame = {
    isOn: true,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0
}
var gLevel = {
    SIZE: 4,
    MINES: 2
}
var gBoard;


function initGame() {
    gGame.isOn = true;
    gGame.shownCount = 0;
    gGame.markedCount = 0;
    gGame.secsPassed = 0;
    gBoard = buildBoard(gLevel);
    console.table(gBoard);
    renderBoard(gBoard, '.board-container')
}
// בניית מודל לוח
function buildBoard(level) {
    var board = []
    for (var i = 0; i < gLevel.SIZE; i++) {
        board[i] = []
        for (var j = 0; j < gLevel.SIZE; j++) {
            var cell = creatCell()
            board[i][j] = cell
        }
    }
    addMines(board, level)
    return board
}

function creatCell() {
    var cell = {
        minesAroundCount: 0,
        isShown: true,
        isMine: false,
        isMarked: false
    }
    return cell
}

function addMines(board, level) {
    for (var i = 0; i < level.MINES; i++) {
        var iIdx = getRandomInt(0, level.SIZE - 1)
        var jIdx = getRandomInt(0, level.SIZE - 1)
        board[iIdx][jIdx].isMine = true
    }
    setMinesNegsCount(board)
}

// בודק שכנים של מוקשים
function setMinesNegsCount(board) {
    for (var I = 0; I < board.length; I++) {
        for (var J = 0; J < board[0].length; J++) {
            var countNegs = 0
            if (board[I][J].isMine) continue
            // console.log('I', I, 'J', J);
            for (var i = (I - 1); i <= (I + 1); i++) {
                if (i < 0 || i >= board.length) continue
                for (var j = (J - 1); j <= (J + 1); j++) {
                    if (j < 0 || j >= board[0].length) continue
                    if (i === I && j === J) continue
                    if (board[i][j].isMine) countNegs++
                }
            }
            board[I][J].minesAroundCount = countNegs
        }

    }
}



// מרנדר לוח
function renderBoard(board, selector) {
    var strHTML = `<table border="0"><tbody>`;
    for (var i = 0; i < board.length; i++) {
        strHTML += `<tr>`;
        for (var j = 0; j < board[0].length; j++) {
            var cell = ` `
            var className = `cell cell-${i}-${j}`;
            strHTML += `<td class=" ${className}" onclick="cellClicked(this, ${i}, ${j})">${cell}`
        }
        strHTML += `</tr>`
    }
    strHTML += `</tbody></table>`;

    var elContainer = document.querySelector(selector);
    elContainer.innerHTML = strHTML;
    // console.log(elContainer);
}



// לחיצה על תא
function cellClicked(elCell, i, j) {
    var currCell = gBoard[i][j]
    if (currCell.isMarked) return
    if (currCell.isMine) {
        var cell = MINE
    } else if (currCell.minesAroundCount) {
        cell = currCell.minesAroundCount
    } else {
        cell = ` `
        expandShown(gBoard, elCell, i, j)
    }
    currCell.isShown = true
    elCell.innerHTML = `<div class="clicked">${cell}</div>`;
}

// פתיחת תאים שכנים
function expandShown(board, elCell, i, j) {
    console.log('hi');
}

// לחיצה ימנית על תא-מסמן
function cellMarked(elCell) {

}

// בדיקת סיום משחק
function checkGameOver() {

}












