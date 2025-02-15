const gameBoard = document.querySelector("#gameBoard");
const ctx = gameBoard.getContext("2d"); //2d context for canvas.CTX is used to draw shapes,text,images etc
const scoreText = document.querySelector("#scoreText");
const resetBtn = document.querySelector("#resetBtn");
const gameWidth = gameBoard.width; //dimensions of canvas
const gameHeight = gameBoard.height; //dimensions of canvas
const boardBackground = "black"; //all are styling variables
const paddle1Color = "blue";
const paddle2Color = "red";
const paddleBorder = "black";
const ballColor = "white";
const ballBorderColor = "black";
const ballRadius = 12.5;
const paddleSpeed = 50;
let intervalID; // used to start/stop the game loop
let ballSpeed; //ball moving speed
let ballX = gameWidth / 2; //current position of ball,initially in center of the board
let ballY = gameHeight / 2; //current position of ball,initially in center of the board
let ballXDirection = 0; //direction of ball is moving along X and Y axis
let ballYDirection = 0;
let player1Score = 0; //score of each player
let player2Score = 0;
let paddle1 = {
  //starts on top left corner
  width: 25,
  height: 100, //size of paddles
  x: 0,
  y: 0,
};
let paddle2 = {
  //starts right bottom corner
  width: 25,
  height: 100,
  x: gameWidth - 25,
  y: gameHeight - 100,
};

window.addEventListener("keydown", changeDirection); //to move paddles
resetBtn.addEventListener("click", resetGame); //restart the game

gameStart(); //start the game

function gameStart() {
  createBall(); //initialize the ball
  nextTick(); //starts the game loop
}
function nextTick() {
  intervalID = setTimeout(() => {
    clearBoard(); //clear the previous frame
    drawPaddles(); //draw the paddles
    moveBall(); //update ball position
    drawBall(ballX, ballY); //draw the ball at new position
    checkCollision(); //checks for collision with walls or paddles
    nextTick(); //calls itself to continue the loop
  }, 10); //run every 10 milliseconds
}
function clearBoard() {
  ctx.fillStyle = boardBackground; // this function means it clears the previous frame
  ctx.fillRect(0, 0, gameWidth, gameHeight); //0,0 means x,y coordinates which starts at left edge and top edge of canvas.
}
function drawPaddles() {
  ctx.strokeStyle = paddleBorder; //strokestyle for borders

  ctx.fillStyle = paddle1Color;
  ctx.fillRect(paddle1.x, paddle1.y, paddle1.width, paddle1.height); //fillrect to draw rectangles
  ctx.strokeRect(paddle1.x, paddle1.y, paddle1.width, paddle1.height); //strokerect to draw borders

  ctx.fillStyle = paddle2Color;
  ctx.fillRect(paddle2.x, paddle2.y, paddle2.width, paddle2.height);
  ctx.strokeRect(paddle2.x, paddle2.y, paddle2.width, paddle2.height);
}
function createBall() {
  ballSpeed = 1; //speed starts at 1
  if (Math.round(Math.random()) == 1) {
    //randomizes the direction of ball using math.random
    ballXDirection = 1;
  } else {
    ballXDirection = -1;
  }
  if (Math.round(Math.random()) == 1) {
    ballYDirection = Math.random() * 1; //more random directions
  } else {
    ballYDirection = Math.random() * -1; //more random directions
  }
  ballX = gameWidth / 2; //positions ball at horizontal to the center
  ballY = gameHeight / 2; //positions ball at vertical to the center
  drawBall(ballX, ballY); //used the draw ball at specified position
}
function moveBall() {
  ballX += ballSpeed * ballXDirection; //updates x and y positions based on speed and directions
  ballY += ballSpeed * ballYDirection;
}
function drawBall(ballX, ballY) {
  ctx.fillStyle = ballColor;
  ctx.strokeStyle = ballBorderColor;
  ctx.lineWidth = 2; //thickness of ball border 2px
  ctx.beginPath(); //starts a new drawing path
  //ball X - x coordinate,ball Y - y coordinate,ballRadius - given above,0 - starting from right of circle,2*math.pi - ending angle of arc
  ctx.arc(ballX, ballY, ballRadius, 0, 2 * Math.PI);
  ctx.stroke(); //draws the border of circle using the color and width specified
  ctx.fill(); //fills the inside of the circle
}
function checkCollision() {
  if (ballY <= 0 + ballRadius) {
    //if ball top edge touches the top wall
    ballYDirection *= -1;
  }
  if (ballY >= gameHeight - ballRadius) {
    //ball bottom edge touches the bottom wall
    ballYDirection *= -1;
    //if either true,it reverses the vertical direction,this makes the ball bounce off the wall
  }
  if (ballX <= 0) {
    //ball has moved off the left side, means Player 2 scores a point.
    player2Score += 1; // increases player 2 score by 1
    updateScore(); //updates the displayed score
    createBall(); //resets to the center to start a new round
    return; //stops the function since round has ended
  }
  if (ballX >= gameWidth) {
    //ball has moved off the right side, meaning Player 1 scores a point.
    player1Score += 1; //increases Player 1 score by 1.
    updateScore();
    createBall();
    return;
  }
  if (ballX <= paddle1.x + paddle1.width + ballRadius) {
    //checks if the right edge of the ball is at or past the left side of Player 1 paddle
    if (ballY > paddle1.y && ballY < paddle1.y + paddle1.height) {
      //ensures that the ball’s vertical position (ballY) is within the top and bottom boundaries of player 1 paddle
      ballX = paddle1.x + paddle1.width + ballRadius; // if ball gets stuck
      ballXDirection *= -1; // reverses the ball’s horizontal direction (from moving left to moving right), making it bounce off the paddle
      ballSpeed += 1; //when ball hits paddle it increases the speed of ball
    }
  }
  if (ballX >= paddle2.x - ballRadius) {
    //checks if the left edge of the ball has reached or passed the right side of Player 2 paddle
    if (ballY > paddle2.y && ballY < paddle2.y + paddle2.height) {
      //checks if the ball’s vertical position (ballY) is within the top and bottom boundaries of Player 2 paddle
      ballX = paddle2.x - ballRadius; // if ball gets stuck
      ballXDirection *= -1; //reverses the ball’s horizontal direction. since Player 2 is on the right, the ball will move right to  left after bouncing off the paddle.
      ballSpeed += 1; //when ball hits paddle it increases the speed of ball
    }
  }
}
function changeDirection(event) {
  const keyPressed = event.keyCode; //stores the key code which is pressed
  const paddle1Up = 87; //w key for player 1
  const paddle1Down = 83; //s key for player 1
  const paddle2Up = 38; //arrow up key for player 2
  const paddle2Down = 40; //arrow down key for player 2

  switch (keyPressed) {
    //checks which key was pressed
    case paddle1Up:
      if (paddle1.y > 0) {
        //to ensure paddle1 y position doesnt move off the top of screen
        paddle1.y -= paddleSpeed; //paddle moves up by subtracting paddleSpeed
      }
      break;
    case paddle1Down:
      if (paddle1.y < gameHeight - paddle1.height) {
        //checks if paddle1 y position is less than the bottom of the game board
        paddle1.y += paddleSpeed; //the paddle moves down by adding paddleSpeed
      }
      break;
    case paddle2Up:
      if (paddle2.y > 0) {
        //checks paddle2 y position doesn’t go off the screen).
        paddle2.y -= paddleSpeed; //the paddle moves up by subtracting paddleSpeed
      }
      break;
    case paddle2Down:
      if (paddle2.y < gameHeight - paddle2.height) {
        //checks if paddle2 y position is within the game board.
        paddle2.y += paddleSpeed; //the paddle moves down by adding paddleSpeed.
      }
      break;
  }
}
function updateScore() {
  //update the score display on screen
  scoreText.textContent = `${player1Score} : ${player2Score}`;
}
function resetGame() {
  //scores set to 0
  player1Score = 0;
  player2Score = 0;
  paddle1 = {
    //paddles are repositioned
    width: 25,
    height: 100,
    x: 0,
    y: 0,
  };
  paddle2 = {
    width: 25,
    height: 100,
    x: gameWidth - 25,
    y: gameHeight - 100,
  };
  ballSpeed = 1; //ball properties are reset
  ballX = 0;
  ballY = 0;
  ballXDirection = 0;
  ballYDirection = 0;
  updateScore();
  clearInterval(intervalID); //stops the game loop
  gameStart(); //game loop restarted
}
