'use strict'


function cellClicked(elCell, i, j) {
    if (!gGame.isOn) return
    isFirstClick(i, j)
    var currCell = gBoard[i][j]
    if (currCell.isMarked) return
    if (currCell.isMine) {
        var cell = MINE
        currCell.isShown = true
        gGame.mineExplodedCount++
    } else if (currCell.minesAroundCount) {
        cell = currCell.minesAroundCount
    } else {
        cell = ` `
        expandShown(gBoard, i, j)
    }
    currCell.isShown = true
    gGame.shownCount++
    renderCell(i,j, cell)
    checkGameOver()
}


function expandShown(board, i, j) {
    for (var I = (i - 1); I <= (i + 1); I++) {
        if (I < 0 || I >= board.length) continue
        for (var J = (j - 1); J <= (j + 1); J++) {
            if (J < 0 || J >= board[0].length) continue
            if (i === I && j === J) continue
            if (board[I][J].isMine) continue
            if (board[I][J].isShown) continue
            if (board[I][J].isMarked) continue
            board[I][J].isShown = true
            gGame.shownCount++
            var cell = (board[I][J].minesAroundCount) ? board[I][J].minesAroundCount : ` `;
            renderCell(I,J, cell)
        }
    }
    checkGameOver()
}

function renderCell(i,j, value) {
    var elCell = document.querySelector(`.cell-${i}-${j}`);
    elCell.innerText = value
    elCell.classList.add('clicked')
}


function cellMarked(elCell, i, j) {
    window.event.preventDefault()
    if (!gGame.isOn) return
    isFirstClick(i, j)
    if (gBoard[i][j].isShown) return
    if (!gBoard[i][j].isMarked) {
        gBoard[i][j].isMarked = true
        gGame.markedCount++
    } else {
        gBoard[i][j].isMarked = false
        gGame.markedCount--
    }
    elCell.classList.toggle('marked')
    checkGameOver()
}


function checkGameOver() {
    var elRestater = document.querySelector('.restarter')
    if (!gGame.shownCount) return
    if (gLevel.SIZE === 4) {
        if (gGame.mineExplodedCount === 1) {
            gGame.emoji = '🙈'
            openAllMines()
            gameOver(elRestater, gGame.emoji)
        } else if (gGame.shownCount + gGame.markedCount === Math.pow(gLevel.SIZE, 2) && gGame.mineExplodedCount < 3) {
            gGame.emoji = '🥳'
            gameOver(elRestater, gGame.emoji)
        }
        return
    }
    if (gGame.shownCount + gGame.markedCount === Math.pow(gLevel.SIZE, 2) && gGame.mineExplodedCount < 3) {
        gGame.emoji = '🥳'
        gameOver(elRestater, gGame.emoji)
        return
    }
    if (gGame.mineExplodedCount === 1) {
        gGame.emoji = '🙊'
        renderLives(2)

    } else if (gGame.mineExplodedCount === 2) {
        gGame.emoji = '🙉'
        renderLives(1)

    } else if (gGame.mineExplodedCount === 3) {
        gGame.emoji = '🙈'
        openAllMines()
        renderLives()
        gameOver(elRestater, gGame.emoji)
        return
    }
    elRestater.innerText = gGame.emoji
}

function gameOver(el, emoji) {
    el.innerText = emoji
    gGame.isOn = false
    gIsFirstClick = false
    clearInterval(gTimer.intervalId)
}

function openAllMines() {
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            if (gBoard[i][j].isShown) continue
            if (gBoard[i][j].isMarked) continue
            if (gBoard[i][j].isMine) {
                var cell = MINE
                renderCell(i,j, cell)
            }
        }
    }
}