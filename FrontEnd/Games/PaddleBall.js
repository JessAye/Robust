
//------------------ Game Code ---------------------//
const canvas = document.getElementById("gameCanvas");
// Used for drawing graphics in the Pong game
const ctx = canvas.getContext("2d");
const paddleWidth = 10;
const paddleHeight = 30;
const ballSize = 5;
// Display prompts to the player
const startMenu = document.getElementById("startMenu");
const endMenu = document.getElementById("endMenu");
const startButton = document.getElementById("startButton");
const playAgainButton = document.getElementById("playAgainButton");
const finalPlayerScore = document.getElementById("finalPlayerScore");
const finalAiPlayerScore = document.getElementById("finalAiPlayerScore");
// Movement
let playerY = (canvas.height - paddleHeight) / 2; // Paddle positions
let aiY = (canvas.height - paddleHeight) / 2;
let playerSpeed = 1;
let ballX = canvas.width / 2; //Ball position
let ballY = canvas.height / 2;
let ballSpeedX = 1; // Ball's vertical speed
let ballSpeedY = 1; // Ball's horizontal speed
let aiPaddleOffset = 18; // Distance from center of AI's paddle where the ball hits
let upPressed = false; // Keyboard controls are pressed
let downPressed = false;
let playerScore = 0;
let aiScore = 0;
const winScore = 3;
let gameLoopId; // Variable for resetting the game loop after score is reached
// Generate a random integer used for AI difficulty
function randInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Draw paddles
function drawRect(x, y, width, height, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, width, height);
}
// Draw ball
function drawCircle(x, y, radius, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.fill();
}
// Draw score
function drawText(text, x, y, color, size) {
    ctx.fillStyle = color;
    ctx.font = size + "px Arial";
    ctx.fillText(text, x, y);
}

function resetBall() {
    ballX = canvas.width / 2;
    ballY = canvas.height / 2;
    ballSpeedX = -ballSpeedX; // Go the opposite direction
    aiCanMove = false; // Reset AI movement flag   
}
// Update player position with smoother and faster movement
function updatePlayerPosition() {
    if (upPressed && playerY > 0) {
        playerY -= playerSpeed;
    }
    if (downPressed && playerY < canvas.height - paddleHeight) {
        playerY += playerSpeed;
    }
    // Smooth choppy movement
    setTimeout(updatePlayerPosition, 10);
}

function gameLoop() {
    // Clear the canvas
    drawRect(0, 0, canvas.width, canvas.height, "#000");
    // Draw the paddles and ball
    drawRect(0, playerY, paddleWidth, paddleHeight, "#1B03A3"); // drawRect(x, y, width, height, color) 
    drawRect(canvas.width - paddleWidth, aiY, paddleWidth, paddleHeight, "#FF3131");
    drawCircle(ballX, ballY, ballSize, "#FFFFFF"); // (x, y, radius, color) 
    // Draw the scores
    drawText(playerScore.toString(), 100, 50, "#1B03A3", 30);
    drawText(aiScore.toString(), canvas.width - 150, 50, "#FF3131", 30); //(text, x, y, color, size)
    // Move the ball
    ballX += ballSpeedX;
    ballY += ballSpeedY;
        // Ball collision with top and bottom walls
        if (ballY - ballSize < 0 || ballY + ballSize > canvas.height) {
            ballSpeedY = -ballSpeedY;
        }
        // Ball collision with paddles
        if (
            (ballX - ballSize < paddleWidth && ballY > playerY && ballY < playerY + paddleHeight) || (ballX + ballSize > canvas.width - paddleWidth && ballY > aiY && ballY < aiY + paddleHeight)) {
            ballSpeedX = -ballSpeedX;
        }
        // Ball out of bounds
        if (ballX < 0) {          
            aiScore++; // AI scores a point
            resetBall();
            delay();

        } else if (ballX > canvas.width) {          
            playerScore++; // Player scores a point
            resetBall();          
        }
        // Check if either player has reached the winning score
        if (playerScore >= winScore || aiScore >= winScore) {
            showEndPrompt();
            clearInterval(gameLoopId); // Stop the game loop
        }
    // Events
    // Mouse controls
    // document.addEventListener("mousemove", (e) => {
    //   const mouseY = e.clientY - canvas.getBoundingClientRect().top;
    //   playerY = mouseY - paddleHeight / 2;
    // });

    
    const arrowTopButton = document.getElementById("arrow-top");
    const arrowBottomButton = document.getElementById("arrow-bottom");
    
    // Clicking buttons control
    // Add event listeners to the "arrow-top" and "arrow-bottom" buttons
    document.getElementById("arrow-top").addEventListener("mousedown", () => {
        upPressed = true;
    });

    document.getElementById("arrow-bottom").addEventListener("mousedown", () => {
        downPressed = true;
    });

    // Add event listeners to stop movement when buttons are released
    document.getElementById("arrow-top").addEventListener("mouseup", () => {
        upPressed = false;
    });

    document.getElementById("arrow-bottom").addEventListener("mouseup", () => {
        downPressed = false;
    });

    // Add event listeners to stop movement when buttons are no longer hovered
    document.getElementById("arrow-top").addEventListener("mouseout", () => {
        upPressed = false;
    });

    document.getElementById("arrow-bottom").addEventListener("mouseout", () => {
        downPressed = false;
    });

    // Directional pad buttons control for mobile users
    arrowTopButton.addEventListener("touchstart", (e) => {
        upPressed = true;
        e.preventDefault(); // Prevent the default behavior (scrolling or zooming)
    });

    arrowTopButton.addEventListener("touchend", () => {
        upPressed = false;
    });

    arrowBottomButton.addEventListener("touchstart", (e) => {
        downPressed = true;
        e.preventDefault(); // Prevent the default behavior (scrolling or zooming)
    });

    arrowBottomButton.addEventListener("touchend", () => {
        downPressed = false;
    });

    // W, S, arrow up,  arrow down controls
    document.addEventListener("keydown", (e) => {
        if (e.key === "w" || e.key == "ArrowUp") {
            upPressed = true;
            e.preventDefault(); // Prevent the default behavior (scrolling)
        } else if (e.key === "s" || e.key == "ArrowDown") {
            downPressed = true;
            e.preventDefault(); // Prevent the default behavior (scrolling)
        }
    });
    document.addEventListener("keyup", (e) => {
        if (e.key === 'w' || e.key == "ArrowUp") {
            upPressed = false;
            e.preventDefault(); // Prevent the default behavior (scrolling)
        } else if (e.key === "s" || e.key == "ArrowDown") {
            downPressed = false;
            e.preventDefault(); // Prevent the default behavior (scrolling)
        }
    });
    // AI control
    // Tweak aiPaddleOffset and speed to adjust difficulty
    const aiCenter = aiY + paddleHeight / 2;
    if (aiCenter < ballY - aiPaddleOffset) { // Offsetting the ball gives the player a chance to score
        aiY += randInt(6, 10);
    } else if (aiCenter > ballY + aiPaddleOffset) {
        aiY -= randInt(6, 10); //ai random speeds help with difficulty
    }
}

//------------------ Start and End Menu Code ---------------------//
canvas.style.display = "none";
endMenu.style.display = "none";

// Start button click event handler
startButton.addEventListener("click", () => {
    startMenu.style.display = "none"; // Hide the start menu
    canvas.style.display = "block"; // Show the game canvas
    gameLoopId = setInterval(gameLoop, 10); // Start the game loop
});

// Play again button click event handler
playAgainButton.addEventListener("click", () => {
    endMenu.style.display = "none"; // Hide the end menu
    canvas.style.display = "block"; // Show the game canvas
    playerScore = 0;
    aiScore = 0;
    resetBall();
    gameLoopId = setInterval(gameLoop, 10); // Start the game loop
});

function showEndPrompt() {
    endMenu.style.display = "block"; // Show the end menu
    finalPlayerScore.textContent = playerScore;
    finalAiPlayerScore.textContent = aiScore;
    canvas.style.display = "none"; // Hide the game canvas
}
// Call the initial gameLoop function to display the start prompt
gameLoop();
updatePlayerPosition(); // Keyboard controls
