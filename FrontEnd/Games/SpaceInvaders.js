let tileSize = 32;
let rows = 16;
let columns = 16;

let board;
let boardWidth = tileSize * columns; // 32 * 16
let boardHeight = tileSize * rows; //32 * 16

let context; 
let flag = 0;


//ship
let shipWidth = tileSize * 2;
let shipHeight = tileSize;
let shipX = tileSize * columns/2 - tileSize;
let shipY = tileSize * rows - tileSize*2

let ship = {
    x : shipX,
    y : shipY,
    width : shipWidth,
    height : shipHeight
}

let shipImg;
let shipVelocityX = tileSize; //ship moving speed

//aliens
let alienArray = [];
let alienWidth = tileSize*2;
let alienHeight = tileSize;
let alienX = tileSize;
let alienY = tileSize;
let alienImg;

let alienRows = 2;
let alienColumns = 3;
let alienCount = 0; //number of aliens to defeat
let alienVelocityX = 1; // alien moving speed

//bullets
let bulletArray = [];
let bulletVelocityY = -10; //bullet moving speed

//score
const playerScore = document.getElementById("finalPlayerScore");
let score = 0;

//Game Over flag
let gameOver = false;

let gameActive = false;

window.onload = function() {
    board = document.getElementById("board");
    board.width = boardWidth;
    board.height = boardHeight;
    context = board.getContext("2d"); 

    // Get the menu elements
    const startMenu = document.getElementById("startMenu");
    const endMenu = document.getElementById("endMenu");
    // Get the buttons in the menus
    const startButton = document.getElementById("startButton");
    const playAgainButton = document.getElementById("playAgainButton");

    // Add event listeners to show the menus
    startButton.addEventListener("click", startGame);
    playAgainButton.addEventListener("click", restartGame);

    board.style.display = "none";
    endMenu.style.display = "none";

    
    //initial ship
    //context.fillStyle="green";
    //context.fillRect(ship.x, ship.y, ship.width, ship.height);

    //load images for game
    //ship
    shipImg = new Image();
    shipImg.src = "./Games/Images/ship.png";
    shipImg.onload = function() {
        context.drawImage(shipImg, ship.x, ship.y, ship.width, ship.height);
    }

    //alien
    alienImg = new Image();
    alienImg.src = "./Games/Images/alienGreen.png";
    createAliens();

    // Function to start the game
    function startGame() {
        startMenu.style.display = "none";
        board.style.display = "block";
        gameActive = true;
        resetGame();
        requestAnimationFrame(update);
        // Add any additional game initialization logic here
    }

    // Function to reset the game
    function resetGame() {
        ship.x = shipX;
        ship.y = shipY;
        alienVelocityX = 0.5;
        alienRows = 2;
        alienColumns = 3;
        alienCount = 0;
        alienArray = [];
        bulletArray = [];
        createAliens();
        score = 0;
        gameOver = false;
    }

    // Function to restart the game
    function restartGame() {
        endMenu.style.display = "none";
        board.style.display = "block";
        gameActive = true;
        resetGame();
        requestAnimationFrame(update);
        // Reset game variables and start a new game
        // Then, call the startGame function to begin a new game.
    }

    // Add event listeners for the "click" and "touchstart" events on the "arrow-left" and "arrow-right" buttons
    const gameLeftButton = document.getElementById("arrow-left");
    const gameRightButton = document.getElementById("arrow-right");

    gameLeftButton.addEventListener("click", moveShipLeft);
    gameLeftButton.addEventListener("touchstart", function(event) {
        event.preventDefault(); // Prevent default touch event behavior
        moveShipLeft();
    });

    gameRightButton.addEventListener("click", moveShipRight);
    gameRightButton.addEventListener("touchstart", function(event) {
    event.preventDefault(); // Prevent default touch event behavior
    moveShipRight();
    });

    //Add event listen so users can't zoom in when tapping the directional buttons on mobile
    const buttonD = document.getElementById("directions");
    buttonD.addEventListener("touchstart", function(event) {
        event.preventDefault();
    });

    // Add event listeners for left and right arrow keys
    document.addEventListener("keydown", moveShip);
    document.addEventListener("keydown", function(event) {
        // Check if the pressed key is the Spacebar
        if (event.key === " ") {
            event.preventDefault(); // Prevent the default page scrolling behavior
        }
    });
    
    // Add event listeners for the "click" and "touchstart" events on the "button-a" element
    const buttonA = document.getElementById("button-a");
    buttonA.addEventListener("click", shootBullet);
    buttonA.addEventListener("touchstart", function(event) {
        event.preventDefault(); // Prevent default touch event behavior
        shootBullet();
    });

    //Add event listen so users can't zoom in when tapping the shoot button on mobile
    const shootButton = document.getElementById("buttons");
    shootButton.addEventListener("touchstart", function(event) {
        event.preventDefault();
    });

    //Add an event listener for the space key to shoot bullets
    document.addEventListener("keyup", shoot);

}

function update() {
    const endMenu = document.getElementById("endMenu");
    requestAnimationFrame(update);
    if (!gameActive) {

        return;
    }
    if (gameOver) { 

        return;
    }

    context.clearRect(0, 0, board.width, board.height );

    //ship
    context.drawImage(shipImg, ship.x, ship.y, ship.width, ship.height);

    //alien
    for(let i = 0; i < alienArray.length; i++){
        let alien = alienArray[i];
        if (alien.alive) {
            alien.x += alienVelocityX;

            //alien touching of border
            if (alien.x + alien.width >= board.width || alien.x <= 0 ){
                alienVelocityX *= -1;
                alien.x += alienVelocityX*2;

                //alien moving down one
                for (let j = 0; j < alienArray.length; j++) {
                    alienArray[j].y += alienHeight;
                }
            }

            context.drawImage(alienImg, alien.x, alien.y, alien.width, alien.height);

            if (alien.y >= ship.y) {
                gameOver = true;    
                gameActive = false;
                board.style.display = "none";
                endMenu.style.display = "block";
            }
        }
    }
    
    //bullets 
    for (let i = 0; i < bulletArray.length; i++) {
        let bullet = bulletArray[i];
        bullet.y += bulletVelocityY;
        context.fillStyle="white";
        context.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);

        //bullet collision with aliens
        for (let j = 0; j < alienArray.length; j++) {
            let alien = alienArray[j];
            if (!bullet.used && alien.alive && detectCollision(bullet, alien)) {
                bullet.used = true;
                alien.alive = false;
                alienCount--;
                score += 100;
            }
        }

    }

    //clear bullets
    while (bulletArray.length > 0 && (bulletArray[0].used || bulletArray[0].y < 0)) {
        bulletArray.shift(); //removes first element of array
    }
    
    //next level
    if (alienCount == 0) {
        //increase number of aliens in collumns and rows by 1
        alienColumns = Math.min(alienColumns + 1, columns/2 - 2); // cap at 6 columns
        alienRows = Math.min(alienRows + 1, rows - 4);
        alienVelocityX += 0.2; //increase alien movement
        alienArray = [];
        bulletArray = [];
        createAliens();

    }

    //score
    context.fillStyle="white";
    context.font="48px courier";
    context.fillText(score, 5, 35);
    playerScore.textContent = score;
}

//Function to move ship with keyboard controls
function moveShip(e) {
    if(gameOver) {
        return;
    }

    if (e.code == "ArrowLeft" && ship.x - shipVelocityX >= 0) {
        ship.x -= shipVelocityX; //move left one tile
    }
    else if (e.code == "ArrowRight" && ship.x + shipVelocityX + shipWidth <= boardWidth) {
        ship.x += shipVelocityX; //move right one tile 
    }
}

//Function to move ship left with the left D-pad
function moveShipLeft() {
    if (!gameOver && ship.x - shipVelocityX >= 0) {
        ship.x -= shipVelocityX; // Move the ship left
    }
}

//Function to move ship right with the right D-pad
function moveShipRight() {
    if (!gameOver && ship.x + shipVelocityX + shipWidth <= boardWidth) {
        ship.x += shipVelocityX; // Move the ship right
    }
}

//Function to create aliens
function createAliens() {
    for (let c = 0; c < alienColumns; c++){
        for (let r = 0; r < alienRows; r++) {
            let alien = {
                img : alienImg,
                x : alienX + c*alienWidth,
                y : alienY + r*alienHeight,
                width : alienWidth,
                height : alienHeight,
                alive : true
            }
            alienArray.push(alien);
        }
    }
    alienCount = alienArray.length;
}

//Function to shoot with a button
function shootBullet() {
    if (!gameOver) {
        // Create a new bullet
        let bullet = {
            x: ship.x + shipWidth * 15/32,
            y: ship.y,
            width: tileSize/8,
            height: tileSize/2,
            used: false
        };

        // Add the bullet to the bulletArray
        bulletArray.push(bullet);
    }
}

//Function to shoot with the Space key
function shoot(e) {
    if (gameOver) {
        return;
    }
    if (e.code == "Space") {
        //shoot
        let bullet = {
            x : ship.x + shipWidth*15/32,
            y: ship.y,
            width : tileSize/8,
            height : tileSize/2,
            used : false
        }
        bulletArray.push(bullet);
    }
}

//Function to detect collision
function detectCollision(a,b) {
    return  a.x < b.x + b.width && //a's top left corner doestn reache b's bottom right corner
            a.x + a.width > b.x && //a's top right corner passes b's left right corner
            a.y < b.y + b.height && //a's top left corner doesnt reache b's bottom left corner
            a.y + a.height > b.y; //a's bottom left corner passes b's top left corner
}
