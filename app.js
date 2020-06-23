// Shooting meteorites
// this game was influenced by
// Code Tetris: JavaScript Tutorial for Beginners by Ania Kubow
// tutorial can be found here: https://youtu.be/rAUn1Lom6dw

document.addEventListener('DOMContentLoaded', () => {
  const grid = document.querySelector('.grid')
  const squares = Array.from(document.querySelectorAll('.grid div'))
  const scoreDisplay = document.querySelector('#score')
  const startBtn = document.querySelector('#start-button')
  const life = document.querySelector('#life-left')
  const leftButton = document.querySelector('#left')
  const rightButton = document.querySelector('#right')
  const fireButton = document.querySelector('#fire')
  const width = 10
  let score = 0
  let enemyCounter = 0
  let enemySpeed = 0
  let enemyNumber = 2000
  let lives = 3
  let gameOn = false

  // The Player's Ship
  const playerShip = [0, width, width + 1, width * 2, width * 2 + 1]
  const playerShipPng = ['turrent', 'engine', 'cockpit', 'left-wheel', 'right-wheel']

  let playerShipPosition = 174
  function drawPlayer () {
    playerShip.forEach(index => {
      squares[playerShipPosition + index].classList.add('player-ship')
      squares[playerShipPosition + index].classList.add(playerShipPng[playerShip.indexOf(index)])
    })
  }

  function undrawPlayer () {
    playerShip.forEach(index => {
      squares[playerShipPosition + index].classList.remove('player-ship')
      squares[playerShipPosition + index].classList.remove(playerShipPng[playerShip.indexOf(index)])
    })
  }

  // move the player left, unless it's at the edge
  function movePlayerLeft () {
    if (gameOn) {
      undrawPlayer()
      const isAtLeftEdge = playerShip.some(index => (playerShipPosition + index) % width === 0)

      if (!isAtLeftEdge) {
        playerShipPosition -= 1
        playerLaserPosition = playerShipPosition - (width * 2)
      }
      drawPlayer()
    }
  }

  // move the player right, unless it's at the edge
  function movePlayerRight () {
    if (gameOn) {
      undrawPlayer()
      const isAtRightEdge = playerShip.some(index => (playerShipPosition + index) % width === width - 1)

      if (!isAtRightEdge) {
        playerShipPosition += 1
        playerLaserPosition = playerShipPosition - (width * 2)
      }
      drawPlayer()
    }
  }

  // Controling player ship
  function control (e) {
    if (e.keyCode === 37) {
      movePlayerLeft()
    } else if (e.keyCode === 39) {
      movePlayerRight()
    } else if (e.keyCode === 32) {
      playerLaserFunction(playerShipPosition)
    }
  }

  // The Player's laser
  const playerLaser = [0, width]

  function playerLaserFunction (pp) {
    let playerLaserPosition = pp - (width * 2)
    let timerLaser = null
    function drawPlayerLaser () {
      playerLaser.forEach(index => {
        squares[playerLaserPosition + index].classList.add('player-laser')
      })
    }

    function undrawPlayerLaser () {
      playerLaser.forEach(index => {
        squares[playerLaserPosition + index].classList.remove('player-laser')
      })
    }
    function laserStop () {
      if (playerLaserPosition < 10) {
        playerLaser.forEach(index => squares[playerLaserPosition + index].classList.remove('player-laser'))
        clearInterval(timerLaser)
        timerLaser = null
      }
    }
    // scoring
    function addScore () {
      if (squares[playerLaserPosition].classList.contains('enemy-ship')) {
        score += 10
        enemySpeed += 5
        enemyCounter += 10
        scoreDisplay.innerHTML = score
        if (enemyCounter === 100) {
          clearInterval(timerId)
          enemyNumber -= 100
          lives += 1
          life.innerHTML = lives
          timerId = setInterval(meteorites, enemyNumber)
          enemyCounter = 0
        }
        squares[playerLaserPosition].classList.remove('player-laser')
        squares[playerLaserPosition].classList.add('hit')
        squares[playerLaserPosition + width].classList.remove('player-laser')
        squares[playerLaserPosition].style.backgroundColor = ''
        squares[playerLaserPosition + width].style.backgroundColor = ''
        playerLaserPosition -= (width * 20)
        clearInterval(timerLaser)
        timerLaser = null
      }
    }
    function playerLaserMoveUp () {
      addScore()
      undrawPlayerLaser()
      playerLaserPosition -= width
      drawPlayerLaser()
      laserStop()
    }
    function shootPlayerLaser () {
      timerLaser = setInterval(playerLaserMoveUp, 100)
    }
    if (gameOn) {
      drawPlayerLaser()
      shootPlayerLaser()
    }
  } // end of player laser

  // The Enemy ship
  function meteorites () {
    function gameOver () {
      if (lives <= 0) {
        gameOn = false
        clearInterval(timerId)
        for (var i = 0; i < squares.length; i++) {
          squares[enemyShipPosition].classList.remove('enemy-ship')
          squares[enemyShipPosition].classList.remove('hit')
        }
        document.getElementById('game-over').innerHTML = '<h3>Game Over</h3><button id="play-again" class="buttons" onclick="location.reload()">Play Again</button>'
        undrawPlayer()
        document.removeEventListener('keyup', control)
        lives = 0
        life.innerHTML = lives
      }
    }

    let enemyShipPosition = (Math.floor(Math.random() * 8) + 1)
    let enemyTimer = null
    function drawEnemyShip () {
      squares[enemyShipPosition].classList.add('enemy-ship')
    }

    function undrawEnemyShip () {
      squares[enemyShipPosition].classList.remove('enemy-ship')
    }

    function enemyShipHitsGround () {
      if (enemyShipPosition >= 190) {
        squares[enemyShipPosition].classList.remove('enemy-ship')
        clearInterval(enemyTimer)
        enemyTimer = null
        lives -= 1
        life.innerHTML = lives
        scoreDisplay.innerHTML = score
      }
      gameOver()
    }

    function enemyShipHitLaser () {
      if (squares[enemyShipPosition].classList.contains('hit')) {
        squares[enemyShipPosition].classList.remove('enemy-ship')
        squares[enemyShipPosition].classList.remove('hit')
        clearInterval(enemyTimer)
        enemyTimer = null
        enemyShipPosition += (width * 20)
      }
    }

    function enemyShipMovesDown () {
      enemyShipHitLaser()
      undrawEnemyShip()
      enemyShipPosition += width
      drawEnemyShip()
      enemyShipHitsGround()
    }
    drawEnemyShip()
    let enemyTimerInterval = 1000 - enemySpeed
    enemyTimer = setInterval(enemyShipMovesDown, enemyTimerInterval)
  } // end meteorites

  // Get everything going
  drawPlayer()
  let timerId
  document.addEventListener('keyup', control)
  rightButton.addEventListener('click', movePlayerRight)
  leftButton.addEventListener('click', movePlayerLeft)
  fireButton.addEventListener('click', () => {
    playerLaserFunction(playerShipPosition)
  })
  startBtn.addEventListener('click', () => {
    gameOn = true
    if (timerId) {
      clearInterval(timerId)
      timerId = null
    } else {
      meteorites()
      timerId = setInterval(meteorites, enemyNumber)
    }
  })
})
