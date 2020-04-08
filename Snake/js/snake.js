const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");

// Utility functions to convert box coordinates to actual coordinates
const Util = {
	getXCoordinate: function(x) {
		return x * Box.size + Box.size / 2;
	},

	getYCoordinate: function(y) {
		return y * Box.size + Box.size / 2 + Scoreboard.height;
	},

	ateFood: function(head) {
		return (head.x == Food.x && head.y == Food.y);
	}
}

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

// Snake
const Snake = {

	pieceSize: Box.size - 2 * Box.padding,
	direction: Direction.RIGHT,
	body: [],

	draw: function() {
		for (let i = 0; i < this.body.length; i++) {
			let x = Util.getXCoordinate(this.body[i].x);
			let y = Util.getYCoordinate(this.body[i].y);
			context.fillStyle = (i == 0 ? "#331a00" : "#663300");
			context.fillRect(x - this.pieceSize / 2, y - this.pieceSize / 2, this.pieceSize, this.pieceSize);
		}
	},

	update: function() {

		// Only animate the snake in playing state
		if (currentState != State.PLAYING) {
			return;
		}

		let oldHead = this.body[0];
		let newHead = {
			x: oldHead.x,
			y: oldHead.y
		};

		switch (this.direction) {

			case Direction.RIGHT:
				newHead.x++;
				break;
			
			case Direction.LEFT:
				newHead.x--;
				break;

			case Direction.UP:
				newHead.y--;
				break;
					
			case Direction.DOWN:
				newHead.y++;
				break;
		}

		if (Util.ateFood(newHead)) {

			// Play score sound
			Sound.SCORE.currentTime = 0;  // To play instantly, irrespective of previous sound finish
			Sound.SCORE.play();
			console.log("Food ate at:", Food.x, Food.y);
			
			// Place food in a new spot
			Food.reset();

			// Increment the score
			Scoreboard.score++;
			console.log("New body: ", this.body);
			console.log("Score:", Scoreboard.score);

		} else {

			// Remove the tail only if the snake didn't eat the food
			this.body.pop();
		}

		// Add a new head
		this.body.unshift(newHead);
		
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
		let x = Util.getXCoordinate(this.x);
		let y = Util.getYCoordinate(this.y);
		context.drawImage(foodImage, x - this.width / 2, y - this.height / 2);
	},

	reset: function() {
		this.x = Math.floor(Math.random() * PlayArea.horizontalRange);
		this.y = Math.floor(Math.random() * PlayArea.verticalRange);
	}
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
			// Check for arrow keys or W, A, S, D
			if ((key == 37 || key == 65) && Snake.direction != Direction.RIGHT) {
				Snake.direction = Direction.LEFT;
			} else if ((key == 38 || key == 87) && Snake.direction != Direction.DOWN) {
				Snake.direction = Direction.UP;
			} else if ((key == 39 || key == 68) && Snake.direction != Direction.LEFT) {
				Snake.direction = Direction.RIGHT;
			} else if ((key == 40 || key == 83) && Snake.direction != Direction.UP) {
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

// Start the game
function startGame() {
	currentState = State.PLAYING;
}

// Game over
function gameOver() {

	// Play die sound
	Sound.DIE.currentTime = 0;  // To play instantly, irrespective of previous sound finish
	Sound.DIE.play();

	// Change game state
	currentState = State.GAME_OVER;
}

// Update the objects
function update() {
	Snake.update();
	// Scoreboard.update();
}

// Draw the objects
function draw() {
	Scoreboard.draw();
	PlayArea.draw();
	Food.draw();
	Snake.draw();
}

// Reset the objects
function reset() {
	Scoreboard.reset();
	Food.reset();
	Snake.reset();
}

// Keep refreshing every frame
function loop() {
	update();
	draw();
}

// Reset objects initially
reset();

// Refresh every 100 ms
setInterval(loop, 100);
