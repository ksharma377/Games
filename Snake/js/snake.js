const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");

// Load images
const foodImage = new Image();
foodImage.src = "images/food.png";

// Load sounds
const Sound = {
	SCORE: new Audio("sounds/sfx_score.mp3"),
	DIE: new Audio("sounds/sfx_die.mp3")
}

// Box
const Box = Object.freeze({
	size: 20,
	padding: 1
});

// Game states
const State = Object.freeze({
	GET_READY: 1,
	PLAYING: 2,
	GAME_OVER: 3
});

// Set current state
let currentState = State.GET_READY;

// Directions
const Direction = Object.freeze({
	UP: 1,
	RIGHT: 2,
	DOWN: 3,
	LEFT: 4
});

// Scoreboard
const Scoreboard = Object.freeze({
	x: 0,
	y: 0,
	width: canvas.width,
	height: 50,
	score: 0,
	best: 0,

	draw: function() {

		// Background color
		context.fillStyle = "#003300";//"#663300";
		context.fillRect(this.x, this.y, this.width, this.height);

		// Food
		context.drawImage(foodImage, this.height / 2 - Food.height / 2, this.height / 2 - Food.height / 2);

		// Score
		context.lineWidth = 2;
		context.font = "35px Teko";
		context.fillStyle = "white";
		context.fillText(this.score, this.height, this.height / 2 + Food.height / 2);
		context.strokeText(this.score, this.height, this.height / 2 + Food.height / 2);
	},

	reset: function() {

		// Reset score at the beginning of a new game
		this.score = 0;
	}
});

// Play area
const PlayArea = Object.freeze({
	x: 0,
	y: Scoreboard.height,
	width: canvas.width,
	height: canvas.height - Scoreboard.height,
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

// Snake
const Snake = {
	pieceSize: Box.size - 2 * Box.padding,
	direction: Direction.RIGHT,
	body: [],

	draw: function() {

	},

	update: function() {

	},

	reset: function() {
		this.direction = Direction.RIGHT;
		this.body.splice(0, this.body.length);
		this.body.push({
			x: PlayArea.horizontalRange / 2,
			y: PlayArea.verticalRange / 2
		});
	}
}

// Food
const Food = {
	x: 0,
	y: 0,
	height: Box.size,
	width: Box.size,

	draw: function() {

	},

	update: function() {

	},

	reset: function() {

	}
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

// Start the game
function startGame() {
	currentState = State.PLAYING;
}

// Game over
function gameOver() {
	currentState = State.GAME_OVER;
	Sound.DIE.currentTime = 0;  // To play instantly, irrespective of previous sound finish
	Sound.DIE.play();
}

// Add click listener to the canvas
canvas.addEventListener("click", function(event) {

	switch (currentState) {

		case State.GET_READY:
			startGame();
			break;

		case State.GAME_OVER:
			currentState = State.GET_READY;
			break;
	}

});

// Add key listener to the window
window.addEventListener("keydown", function(event) {

	let key = event.keyCode;

	switch (currentState) {

		case State.GET_READY:
			// Check for Enter or Spacebar keys
			if (key == 13 || key == 32) {
				startGame();
			}
			break;

		case State.PLAYING:
			// Check for arrow keys
			if (key == 37 && Snake.direction != Direction.RIGHT) {
				Snake.direction = Direction.LEFT;
			} else if (key == 38 && Snake.direction != Direction.DOWN) {
				Snake.direction = Direction.UP;
			} else if (key == 39 && Snake.direction != Direction.LEFT) {
				Snake.direction = Direction.RIGHT;
			} else if (key == 40 && Snake.direction != Direction.UP) {
				Snake.direction = Direction.DOWN;
			}
			break;
		
		case State.GAME_OVER:
			// Check for Enter or Spacebar keys
			if (key == 13 || key == 32) {
				currentState = State.GET_READY;
			}
			break;
	}

});

// Update the objects
function update() {
	
}

// Draw the objects
function draw() {
	Scoreboard.draw();
	PlayArea.draw();
}

// Reset the objects
function reset() {
	Scoreboard.reset();
	Snake.reset();
}

// Keep refreshing every frame
function loop() {
	update();
	draw();
	requestAnimationFrame(loop);
}

reset();
// Refresh every 100 ms
setInterval(loop, 100);
