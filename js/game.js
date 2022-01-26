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
    var iNums = shuffle(creatNumsList(level.SIZE))
    var jNums = shuffle(creatNumsList(level.SIZE))
    for (var i = 0; i < level.MINES; i++) {
        var iIdx = drawNum(iNums)
        var jIdx = drawNum(jNums)
        board[iIdx][jIdx].isMine = true
    }
    setMinesNegsCount(board)
}

// בודק שכנים של מוקשים
function setMinesNegsCount(board) {
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++) {
            var countNegs = 0
            if (board[i][j].isMine) continue
            var negs = getNegs(board, i, j)
            for (var I = 0; I < negs.length; I++) {

                if (negs[I].isMine) countNegs++
            }
            board[i][j].minesAroundCount = countNegs
        }

    }
}

function getNegs(board, i, j) {
    var negs = []
    for (var I = (i - 1); I <= (i + 1); I++) {
        if (I < 0 || I >= board.length) continue
        for (var J = (j - 1); J <= (j + 1); J++) {
            if (J < 0 || J >= board[0].length) continue
            if (i === I && j === J) continue
            var neg = board[I][J]
            negs.push(neg)
        }
    }
    return negs
}

function changeLevel(elCell) {
    var size = elCell.innerText
    gLevel.SIZE = +size
    switch (+size) {
        case 4:
            gLevel.MINES = 2
            break;
        case 8:
            gLevel.MINES = 12
            break;
        case 12:
            gLevel.MINES = 30
            break;
    }
    initGame()
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
        expandShown(gBoard, i, j)
    }
    currCell.isShown = true
    elCell.innerHTML = `<div class="clicked">${cell}</div>`;
}

// פתיחת תאים שכנים
function expandShown(board, i, j) {
    for (var I = (i - 1); I <= (i + 1); I++) {
        if (I < 0 || I >= board.length) continue
        for (var J = (j - 1); J <= (j + 1); J++) {
            if (J < 0 || J >= board[0].length) continue
            if (i === I && j === J) continue
            if (board[I][J].isMine) continue
            board[I][J].isShown = true
            var cell = (board[I][J].minesAroundCount) ? board[I][J].minesAroundCount : ` `;
            var location = {
                i: I,
                j: J
            }
            renderCell(location, getCellHTML(cell))
        }
    }
}

function getCellHTML(cell) {
    return `<div class="clicked">${cell}</div>`
}

// לחיצה ימנית על תא-מסמן
function cellMarked(elCell) {

}

// בדיקת סיום משחק
function checkGameOver() {

}












