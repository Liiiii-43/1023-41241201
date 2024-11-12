const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// 遊戲物件參數
const paddleHeight = 10;
const paddleWidth = 75;
let paddleX = (canvas.width - paddleWidth) / 2;

const ballRadius = 10;
let x = canvas.width / 2;
let y = canvas.height - 30;

let dx = 0; // 初始球速
let dy = 0; // 初始球速

let score = 0;
let lives = 3;
let isGameStarted = false;
let isGameOver = false;
let difficultySelected = false;

let brickRowCount = 0;
let brickColumnCount = 0;
const brickWidth = 75;
const brickHeight = 20;
const brickPadding = 10;
const brickOffsetTop = 30;
const brickOffsetLeft = 30;

let bricks = [];

let rightPressed = false;
let leftPressed = false;

document.addEventListener("keydown", keyDownHandler);
document.addEventListener("keyup", keyUpHandler);
canvas.addEventListener("click", startGame);
document.addEventListener("keydown", (e) => {
    if (e.code === "Space") {
        startGame();
    }
});

function keyDownHandler(e) {
    if (e.key === "Right" || e.key === "ArrowRight") {
        rightPressed = true;
    } else if (e.key === "Left" || e.key === "ArrowLeft") {
        leftPressed = true;
    }
}

function keyUpHandler(e) {
    if (e.key === "Right" || e.key === "ArrowRight") {
        rightPressed = false;
    } else if (e.key === "Left" || e.key === "ArrowLeft") {
        leftPressed = false;
    }
}

function drawBall() {
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = "#92AFD6";
    ctx.fill();
    ctx.closePath();
}

function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
    ctx.fillStyle = "#92AFD6";
    ctx.fill();
    ctx.closePath();
}

function drawBricks() {
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            const b = bricks[c][r];
            if (b.status > 0) {
                const brickX = (c * (brickWidth + brickPadding)) + brickOffsetLeft;
                const brickY = (r * (brickHeight + brickPadding)) + brickOffsetTop;
                b.x = brickX;
                b.y = brickY;

                ctx.beginPath();
                ctx.rect(brickX, brickY, brickWidth, brickHeight);
                ctx.fillStyle = b.status === 3 ? "#7D91A6" : b.status === 2 ? "#A1B1CB" : "#C5D0E2";
                ctx.fill();
                ctx.closePath();

                ctx.fillStyle = "#333";
                ctx.font = "16px Arial";
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";
                ctx.fillText(b.status, brickX + brickWidth / 2, brickY + brickHeight / 2);
            }
        }
    }
}

function collisionDetection() {
    let allBricksBroken = true;

    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            const b = bricks[c][r];
            if (b.status > 0) {
                allBricksBroken = false;
                if (x > b.x && x < b.x + brickWidth && y > b.y && y < b.y + brickHeight) {
                    dy = -dy;
                    b.status--;
                    score++;
                }
            }
        }
    }

    if (allBricksBroken) {
        showLevelComplete();
    }
}

function drawScore() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.textAlign = "left";
    ctx.fillText("分數: " + score, 10, 20);
}

function drawLives() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#FF4B4B";
    ctx.textAlign = "right";
    ctx.fillText("❤️ x " + lives, canvas.width - 10, 20);
}

function showGameOver() {
    isGameOver = true;
    ctx.font = "24px Arial";
    ctx.fillStyle = "#FF4B4B";
    ctx.textAlign = "center";
    ctx.fillText("遊戲結束！點擊畫布重新開始", canvas.width / 2, canvas.height / 2);
}

function showLevelComplete() {
    isGameStarted = false;
    ctx.font = "24px Arial";
    ctx.fillStyle = "#4CAF50";
    ctx.textAlign = "center";
    ctx.fillText("恭喜您過關！", canvas.width / 2, canvas.height / 2);
    setTimeout(nextLevel, 2000);
}

function nextLevel() {
    resetLevel();
}

function resetLevel() {
    x = canvas.width / 2;
    y = canvas.height - 30;
    paddleX = (canvas.width - paddleWidth) / 2;
    isGameOver = false;
    draw();
}

function selectDifficulty(difficulty) {
    if (!difficultySelected) {
        if (difficulty === 'easy') {
            dx = 1;
            dy = -1;
            brickRowCount = 3;
            brickColumnCount = 3;
            setupBricks(1);
        } else if (difficulty === 'medium') {
            dx = 2;
            dy = -2;
            brickRowCount = 4;
            brickColumnCount = 5;
            setupBricks(2);
        } else if (difficulty === 'hard') {
            dx = 3;
            dy = -3;

            // 計算適合的列數和行數，避免超出遊戲畫布
            brickColumnCount = Math.floor((canvas.width - brickOffsetLeft) / (brickWidth + brickPadding));
            brickRowCount = Math.floor((canvas.height / 2 - brickOffsetTop) / (brickHeight + brickPadding));
            setupBricks(3);
        }
        alert(`已選擇 ${difficulty} 難度！請點擊或按空白鍵開始遊戲。`);
        difficultySelected = true;
    }
}

function setupBricks(maxStatus) {
    bricks = [];
    for (let c = 0; c < brickColumnCount; c++) {
        bricks[c] = [];
        for (let r = 0; r < brickRowCount; r++) {
            const status = Math.floor(Math.random() * maxStatus) + 1;
            bricks[c][r] = { x: 0, y: 0, status: status };
        }
    }
}

function startGame() {
    if (!isGameStarted && difficultySelected) {
        isGameStarted = true;
        draw();
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    drawBricks();
    drawBall();
    drawPaddle();
    drawScore();
    drawLives();
    collisionDetection();

    if (isGameOver) return;

    if (isGameStarted) {
        if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
            dx = -dx;
        }
        if (y + dy < ballRadius) {
            dy = -dy;
        } else if (y + dy > canvas.height - ballRadius) {
            lives--;
            if (lives === 0) {
                showGameOver();
                return;
            } else {
                resetLevel();
                return;
            }
        }

        if (y + ballRadius >= canvas.height - paddleHeight && x > paddleX && x < paddleX + paddleWidth) {
            dy = -dy;
        }

        if (rightPressed && paddleX < canvas.width - paddleWidth) {
            paddleX += 7;
        }
        if (leftPressed && paddleX > 0) {
            paddleX -= 7;
        }

        x += dx;
        y += dy;
    }

    requestAnimationFrame(draw);
}
