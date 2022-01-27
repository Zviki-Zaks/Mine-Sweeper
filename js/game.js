'use strict'

const MINE = '💥'
const FLAG = '🚩'

var gGame = {
    isOn: true,
    shownCount: 0,
    markedCount: 0,
    mineExplodedCount: 0,
    emoji: '😀'
}
var gLevel = {
    SIZE: 4,
    MINES: 2
}

var gTimer = {
    secsPassed: 0,
    elMinutesLabel: document.getElementById("minutes"),
    elSecondsLabel: document.getElementById("seconds"),
    intervalId: 0
}
var gBoard;
var gIsFirstClick = true


function initGame() {
    gGame.isOn = true;
    gGame.shownCount = 0;
    gGame.markedCount = 0;
    gGame.mineExplodedCount = 0;
    gTimer.secsPassed = 0;
    gTimer.elMinutesLabel.innerHTML = '00'
    gTimer.elSecondsLabel.innerHTML = '00'
    gBoard = buildBoard(gLevel);
    renderBoard(gBoard, '.board-container')
    gIsFirstClick = true

}

function buildBoard(level) {
    var board = []
    for (var i = 0; i < level.SIZE; i++) {
        board[i] = []
        for (var j = 0; j < level.SIZE; j++) {
            var cell = creatCell()
            board[i][j] = cell
        }
    }

    return board
}

function creatCell() {
    var cell = {
        minesAroundCount: 0,
        isShown: false,
        isMine: false,
        isMarked: false
    }
    return cell
}

function isFirstClick(i, j) {
    if (gIsFirstClick) {
        addMines(i, j)
        gIsFirstClick = false
        gTimer.intervalId = setInterval(setTime, 1000)

    }
}

function addMines(i, j) {
    var minesCount = 0
    while (minesCount !== gLevel.MINES) {
        var iIdx = getRandomInt(0, gLevel.SIZE - 1)
        var jIdx = getRandomInt(0, gLevel.SIZE - 1)
        if (gBoard[iIdx][jIdx] === gBoard[i][j]) continue
        if (gBoard[iIdx][jIdx].isMine) continue
        gBoard[iIdx][jIdx].isMine = true
        minesCount++
    }
    setMinesNegsCount()
}

function setMinesNegsCount() {
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            var countNegs = 0
            if (gBoard[i][j].isMine) continue
            var negs = getNegs(gBoard, i, j)
            for (var I = 0; I < negs.length; I++) {

                if (negs[I].isMine) countNegs++
            }
            gBoard[i][j].minesAroundCount = countNegs
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

function changeLevel(size) {
    gLevel.SIZE = size
    switch (size) {
        case 4:
            gLevel.MINES = 2
            document.querySelector('.lives').style.display = 'none'
            break;
        case 8:
            gLevel.MINES = 12
            renderLives(3)
            break;
        case 12:
            gLevel.MINES = 30
            renderLives(3)
            break;
    }
    gGame.emoji = '😀'
    document.querySelector('.restarter').innerText = gGame.emoji
    clearInterval(gTimer.intervalId)
    initGame()
}

function renderBoard(board, selector) {
    var strHTML = `<table border="0"><tbody>`;
    for (var i = 0; i < board.length; i++) {
        strHTML += `<tr>`;
        for (var j = 0; j < board[0].length; j++) {
            var classCell = getClassCell(gLevel.SIZE)
            var className = `cell cell-${i}-${j}`;
            strHTML += `<td class=" ${className} ${classCell}" onclick="cellClicked(this, ${i}, ${j})" oncontextmenu="cellMarked(this, ${i}, ${j})"> `
        }
        strHTML += `</tr>`
    }
    strHTML += `</tbody></table>`;
    // console.log(strHTML);
    var elContainer = document.querySelector(selector);
    elContainer.innerHTML = strHTML;
}

function getClassCell(boardSize) {
    var sizeCell = ``
    if (boardSize === 4) {
        sizeCell = `big-cell`
    } else if (boardSize === 8) {
        sizeCell = `medium-cell`
    } else if (boardSize === 12) {
        sizeCell = `small-cell`
    }
    return sizeCell
}

function restart() {
    gGame.emoji = '😀'
    document.querySelector('.restarter').innerText = gGame.emoji
    changeLevel(4)
    clearInterval(gTimer.intervalId)
    initGame()
}


function setTime() {
    gTimer.secsPassed++
    gTimer.elMinutesLabel.innerHTML = pad(parseInt(gTimer.secsPassed / 60));
    gTimer.elSecondsLabel.innerHTML = pad(gTimer.secsPassed % 60);
}

function renderLives(count) {
    var value = (count === 3) ? `🧡💛💚` : (count === 2) ? `🧡💛` : (count === 1) ? ` 🧡` : ` `;
    var elLives = document.querySelector('.lives')
    elLives.style.display = 'inline-block'
    elLives.querySelector('span').innerText = `${value}`
}




