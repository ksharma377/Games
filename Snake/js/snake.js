const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");

// Box
const Box = Object.freeze({
	size: 20,
	padding: 1
});

// Size of snake piece: 18x18
// const snakePiece = Box.size - 2 * Box.padding; 

// Load the images
const foodImage = new Image();
foodImage.src = "images/food.png";

// Sounds
const Sounds = {
	score: new Audio("sounds/sfx_score.mp3"),
	die: new Audio("sounds/sfx_die.mp3")
}

// Load the sound effects
// const scoreSound = new Audio("sounds/sfx_score.mp3");
// const dieSound = new Audio("sounds/sfx_die.mp3");

// Score board
const ScoreBoard = Object.freeze({
	x: 0,
	y: 0,
	width: canvas.width,
	height: 50,

	draw: function() {
		context.fillStyle = "#663300";
		context.fillRect(this.x, this.y, this.width, this.height);
	}
});

// Play area
const PlayArea = Object.freeze({
	x: 0,
	y: ScoreBoard.height,
	width: canvas.width,
	height: canvas.height - ScoreBoard.height,
	get horizontalRange() { return this.width / Box.size },
	get verticalRange() { return this.height / Box.size },

	draw: function() {
		context.fillStyle = "#009933";
		context.fillRect(this.x, this.y, this.width, this.height);
	}
});

// // Horizontal and vertical range
// const horizontalRange = PlayArea.width / box;
// const verticalRange = PlayArea.height / box;

// Game states
const State = Object.freeze({
	GET_READY: 1,
	PLAYING: 2,
	GAME_OVER: 3
});

// Set current state
let currentState = State.GET_READY;

// Snake direction
const Direction = Object.freeze({
	UP: 1,
	RIGHT: 2,
	DOWN: 3,
	LEFT: 4
});

// Set current direction
let currentDirection = Direction.RIGHT;

// Start the game
function startGame() {
	currentState = State.PLAYING;
}

// Add click listener to the canvas
canvas.addEventListener("click", function(event) {

	switch (currentState) {

		case State.GET_READY:
			startGame();
			break;
		
		case State.PLAYING:
			break;

		case State.GAME_OVER:
			let canvasCoordinates = canvas.getBoundingClientRect();
			let clickX = event.clientX - canvasCoordinates.left;
			let clickY = event.clientY - canvasCoordinates.top;

			// Check if the "start" button is clicked
			if (clickX >= startButton.x && clickX <= startButton.x + startButton.width &&
				clickY >= startButton.y && clickY <= startButton.y + startButton.height) {

				score.reset();
				currentState = State.GET_READY;
			}
			
			break;
	}
});

// Add key listener to the window
window.addEventListener("keydown", function(event) {

	// Check if the key pressed is "space bar"
	if (event.keyCode == 32) {

		switch (currentState) {

			case State.GET_READY:
				startGame();
				break;
			
			case State.PLAYING:
				break;
		}
	}
});

// Snake
const Snake = {
	pieceSize: Box.size - 2 * Box.padding,
	body: [
		{
			x: PlayArea.width / 2 - Box.size / 2
		},
		{

		}
	],

	draw: function() {

	},

	update: function() {

	}
}

// Food
const Food = {

}

// Score
const score = {
	best: 0,
	value: 0,

	draw: function() {

		context.fillStyle = "#ffffff";
		context.strokeStyle = "#000000";

		if (currentState == State.PLAYING) {
			context.lineWidth = 2;
			context.font = "35px Teko";
			context.fillText(this.value, canvas.width / 2 - 16, 50);
			context.strokeText(this.value, canvas.width / 2 - 16, 50);
		} else if (currentState == State.GAME_OVER) {
			context.font = "25px Teko";
			context.fillText(this.value, gameOver.destinationX + gameOver.width - 50, gameOver.destinationY + 95);
			context.strokeText(this.value, gameOver.destinationX + gameOver.width - 50, gameOver.destinationY + 95);
			context.fillText(this.best, gameOver.destinationX + gameOver.width - 50, gameOver.destinationY + gameOver.height - 65);
			context.strokeText(this.best, gameOver.destinationX + gameOver.width - 50, gameOver.destinationY + gameOver.height - 65);
		}
	},

	reset: function() {

		// Reset the score when a game begins
		this.value = 0;
	}
}

// Update the objects
function update() {
	
}

// Draw the objects
function draw() {
	// context.fillStyle = "#009933";
	// context.fillRect(0, 0, canvas.width, canvas.height);
	ScoreBoard.draw();
	PlayArea.draw();
}

// Keep refreshing every frame
function loop() {
	update();
	draw();
	frames++;
	requestAnimationFrame(loop);
}

loop();
