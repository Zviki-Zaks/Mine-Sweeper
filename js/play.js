'use strict'


function cellClicked(elCell, i, j) {
    if (!gGame.isOn) return
    isFirstClick(i, j)
    var currCell = gBoard[i][j]
    if (currCell.isMarked) return
    if (currCell.isMine) {
        currCell.isShown = true
        gGame.mineExplodedCount++
        elCell.classList.add('mine')
    } else if (currCell.minesAroundCount) {
        var cell = currCell.minesAroundCount
        renderCell(i, j, cell)
    } else {
        cell = ` `
        expandShown(gBoard, i, j)
        renderCell(i, j, cell)
    }
    currCell.isShown = true
    gGame.shownCount++
    checkGameOver()
}


function expandShown(board, iIdx, jIdx) {
    for (var i = (iIdx - 1); i <= (iIdx + 1); i++) {
        if (i < 0 || i >= board.length) continue
        for (var j = (jIdx - 1); j <= (jIdx + 1); j++) {
            if (j < 0 || j >= board[0].length) continue
            if (iIdx === i && jIdx === j) continue
            if (board[i][j].isMine) continue
            if (board[i][j].isShown) continue
            if (board[i][j].isMarked) continue
            if (board[i][j].minesAroundCount){
                
                board[i][j].isShown = true
                gGame.shownCount++
                var cell = (board[i][j].minesAroundCount) ? board[i][j].minesAroundCount : ` `;
                renderCell(i, j, cell)
                
            } else{
                board[i][j].isShown = true
                gGame.shownCount++
                expandShown(board, i, j)
                var cell = (board[i][j].minesAroundCount) ? board[i][j].minesAroundCount : ` `;
                renderCell(i, j, cell)
            }
        }
    }
    checkGameOver()
}

function renderCell(i, j, value) {
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
    if (gGame.shownCount + gGame.markedCount === Math.pow(gLevel.SIZE, 2) && gGame.markedCount===gLevel.MINES) {
        gGame.emoji = '🥳'
        gameOver(elRestater, gGame.emoji)
        return
    }
    if (gLevel.SIZE === 4) {
        if (gGame.mineExplodedCount === 1) {
            gGame.emoji = '😵'
            openAllMines()
            gameOver(elRestater, gGame.emoji)
        } 
        return
    }
    if (gGame.mineExplodedCount === 1) {
        renderLives(2)
        return

    } else if (gGame.mineExplodedCount === 2) {
        renderLives(1)
        return
    } else if (gGame.mineExplodedCount === 3) {
        gGame.emoji = '😵'
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
                var elCell = document.querySelector(`.cell-${i}-${j}`)
                elCell.classList.add('mine')
            }
        }
    }
}