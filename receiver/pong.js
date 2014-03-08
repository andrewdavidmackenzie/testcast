//////////////////////////////////// PADDLE ////////////////////////////////
function Paddle(x, y, width, height, courtHeight, context, courtColor, soundFileName) {
    this.defaultSpeed = Math.floor(2 * courtHeight) / 100; // 2% of the height
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.halfHeight = Math.floor(this.height / 2);
    this.context = context;
    this.speed = 0;
    this.maxY = courtHeight - this.height;
    this.courtColor = courtColor;
    this.bounce = new Audio(soundFileName);
}

Paddle.prototype.render = function (color) {
    this.context.fillStyle = color;
    this.context.fillRect(this.x, this.y, this.width, this.height);
}

Paddle.prototype.moveUp = function () {
    this.move(-this.defaultSpeed);
}

Paddle.prototype.moveDown = function () {
    this.move(this.defaultSpeed);
}

Paddle.prototype.stop = function () {
    this.speed = 0;
}

Paddle.prototype.move = function (distance) {
    // Delete the old one by drawing over it in the background color
    this.render(this.courtColor);

    this.y += distance;
    this.speed = distance;

    // Stop at the top of the court
    if (this.y <= 0) {
        this.y = 0;
        this.speed = 0;
    } else if (this.y >= this.maxY) {
        this.y = this.maxY;
        this.speed = 0;
    }
}

//////////////////////////////////// BASE PLAYER ////////////////////////////////
function BasePlayer(name) {
    this.name = name;
    this.score = 0;
}

BasePlayer.prototype.givePaddle = function (paddle) {
    this.paddle = paddle;
}

/////////////////////////////////// HUMAN PLAYER ////////////////////////////////
function Player(name) {
    BasePlayer.call(name);
}
Player.prototype.constructor = Player;
Player.prototype = new BasePlayer(name);

Player.prototype.updatePaddle = function (ball) {
    if (window.keysDown.size > 0) {
        for (var key in window.keysDown) {
            var value = Number(key);
            if (value == 37) { // left arrow
                this.paddle.moveUp();
            } else if (value == 39) { // right arrow
                this.paddle.moveDown();
            }
        }
    } else {
        this.paddle.stop();
    }
}

/////////////////////////////// COMPUTER PLAYER ////////////////////////////////
function Computer(name) {
    BasePlayer.call(name);
}

Computer.prototype.constructor = Computer;
Computer.prototype = new BasePlayer(name);

Computer.prototype.updatePaddle = function (ball) {
    /*
     var ballSign = ball.x_speed ? ball.x_speed < 0 ? -1 : 1 : 0;
     var offset = this.paddle.x - ball.x;
     var offsetSign = offset ? offset < 0 ? -1 : 1 : 0;

     If coming towards me follow it. Until then tend to center.
     */

    var diff = this.paddle.y + this.paddle.halfHeight - ball.y;
    this.paddle.move(Math.floor(-(diff * 3) / 4));
}

//////////////////////////////////// BALL ////////////////////////////////
function Ball(court, ballSize, context, courtColor) {
    this.defaultSpeed = Math.floor(court.width / 200);
    this.court = court;
    this.ballSize = ballSize;
    this.halfBallSize = Math.floor(ballSize / 2);
    this.context = context;
    this.courtColor = courtColor;
    this.x = Math.floor(this.court.width / 2);
    this.y = Math.floor(this.court.height / 2);
    this.y_speed = 0;
    this.x_speed = this.defaultSpeed;
}

Ball.prototype.render = function (color) {
    this.context.fillStyle = color;
    this.context.fillRect(this.x - this.halfBallSize, this.y - this.halfBallSize, this.ballSize, this.ballSize);
}

Ball.prototype.bounceWall = function (court) {
    this.y_speed = -this.y_speed;
    court.bounce.play();
}

Ball.prototype.bouncePaddle = function (paddle) {
    this.x_speed = -this.x_speed;
    this.y_speed += Math.floor(paddle.speed / 2);
    paddle.bounce.play();
}

Ball.prototype.update = function () {
    // Delete the old one
    this.render(this.courtColor);

    // update position according to its speed
    this.x += this.x_speed;
    this.y += this.y_speed;

    var top_y = this.y - this.halfBallSize;
    // If hits the top wall
    if (top_y <= 0) {
        this.y = this.halfBallSize;
        this.bounceWall(this.court);
        return 0;
    }

    var bottom_y = this.y + this.halfBallSize;
    // if hits bottom wall
    if (bottom_y >= this.court.height) {
        this.y = this.court.height - this.halfBallSize;
        this.bounceWall(this.court);
        return 0;
    }

    if (this.x_speed < 0) { // Going left
        // if leaves the court at the left
        if (this.x < 0) {
            return -1;
        }

        if ((this.x < this.court.halfWidth)) { // In left half of the court?
            if ((this.x <= this.court.paddle1.x + this.court.paddle1.width) &&
                (bottom_y > this.court.paddle1.y) &&
                (top_y < (this.court.paddle1.y + this.court.paddle1.height))) {
                this.bouncePaddle(this.court.paddle1);
            }
        }
    } else { // Going right
        // if leaves the court at the right
        if (this.x > this.court.width) {
            return 1;
        }

        if ((this.x > this.court.halfWidth)) {
            if ((this.x >= this.court.paddle2.x) &&
                (bottom_y > this.court.paddle2.y) &&
                (top_y < (this.court.paddle2.y + this.court.paddle2.height))) {
                this.bouncePaddle(this.court.paddle2);
            }
        }
    }

    return 0;
}

//////////////////////////////////// SCOREBOARD ////////////////////////////////
function ScoreBoard(court) {
    this.court = court;
    this.context = court.context;
    this.pointWonSound = new Audio('point.ogg');
    this.fontHeight = Math.floor((court.height * 10) / 100);
    this.fontBaseline = 20 + this.fontHeight;
    // This should be gotten from font metrics!
    this.fontWidth = 50;
    this.score1X = Math.floor((court.width / 2) - (2 * this.fontWidth));
    this.score2X = Math.floor((court.width / 2) + (2 * this.fontWidth));
}

ScoreBoard.prototype.pointWon = function (player) {
    // Play point won sound
    this.pointWonSound.play();

    // Delete old score
//    this.render(this.court.courtColor);

    // increment score of that player
    player.score++;
}

ScoreBoard.prototype.render = function (color) {
    this.render('#ffffff');
}

ScoreBoard.prototype.render = function (color) {
    // Set text font
    this.context.font = this.fontHeight + 'px Pong';
    // Show new scores
    this.context.textAlign = 'right';
    this.context.fillText(this.court.game.player1.score, this.score1X, this.fontBaseline);
    this.context.textAlign = 'left';
    this.context.fillText(this.court.game.player2.score, this.score2X, this.fontBaseline);

    // Right justify text
/*
    var numDigits = 1;
    if (court.game.player2.score > 9) {
        numDigits++;
    }
    this.context.fillText(this.court.game.player2.score, this.score2X + (numDigits * this.fontWidth), this.fontBaseline);
    */
}

//////////////////////////////////// COURT ////////////////////////////////
function Court(canvas, stats) {
    this.context = canvas.getContext('2d');
    this.courtColor = "#999999"

//    this.context.canvas.width = window.innerWidth;
//    this.context.canvas.height = window.innerHeight;

    this.width = canvas.width;
    this.height = canvas.height;
    this.halfWidth = Math.floor(this.width / 2);

    // Draw court initially
    this.context.fillStyle = this.courtColor;
    this.context.fillRect(0, 0, this.width, this.height);

    var paddleWidth = 10;
    var paddleHeight = 50;
    var paddleXOffset = 60;
    this.paddleColor = "#FFFFFF";
    var courtMiddleY = Math.floor((this.height - paddleHeight) / 2);
    this.paddle1 = new Paddle(paddleXOffset, courtMiddleY, paddleWidth, paddleHeight, this.width, this.context, this.courtColor, 'paddle.ogg');
    this.paddle2 = new Paddle(this.width - paddleXOffset - paddleWidth, courtMiddleY, paddleWidth, paddleHeight, this.width, this.context, this.courtColor, 'paddle.ogg');

    // Create a new ball in the center of the court - not moving
    this.ballSize = 10;
    this.ballColor = "#FFFFFF";
    this.ball = new Ball(this, this.ballSize, this.context, this.courtColor);

    // Start off ready for demo mode with two computer players
    this.setPlayer1(new Computer("Demo1"));
    this.setPlayer2(new Computer("Demo2"));

    this.scoreboard = new ScoreBoard(this);

    this.bounce = new Audio('court.ogg');

    this.stats = stats;

    // Install into the global window object
    window.court = this;
}

Court.prototype.setPlayer1 = function (player) {
    this.player1 = player;
    this.player1.givePaddle(this.paddle1);
}

Court.prototype.setPlayer2 = function (player) {
    this.player2 = player;
    this.player2.givePaddle(this.paddle2);
}

Court.prototype.update = function () {
    this.player1.updatePaddle(this.ball);
    this.player2.updatePaddle(this.ball);

    // Update the ball position and detect if it has exited one end of the court or another
    var result = this.ball.update();

    if (result != 0) {
        if (result == -1)
            this.game.point(this.game.player1);
        else
            this.game.point(this.game.player2);
    }

    this.render();
}

Court.prototype.render = function () {
    this.paddle1.render(this.paddleColor);
    this.paddle2.render(this.paddleColor);
    this.ball.render(this.ballColor);

    // TODO Render the score card from the game
}

Court.prototype.step = function () {
    if (window.court.game.playing) {
        if (this.stats) {
            this.stats.begin();
        }

        // Update the positions of the objects
        window.court.update();

        if (this.stats) {
            this.stats.end();
        }

        // reschedule next animation update
        window.animater(window.court.step);
    }
}

//////////////////////////////////// GAME ////////////////////////////////
function Game(court) {
    this.court = court;
    this.playing = false;
    this.court.game = this;
    // TODO find a game over sound
//    this.gameWon = new Audio('game.ogg');

}

// Only start the game if one or two players - second would be computer
// Supply maximum number of poins for the game
Game.prototype.start = function () {
    // Pick up the players from the court
    this.player1 = this.court.player1;
    this.player2 = this.court.player2;
    this.player1.score = 0;
    this.player2.score = 0;

    // draw initial scoreboard
    this.court.scoreboard.render();

    // Create a new ball in the center of the court - Moving
    this.court.ball = new Ball(this.court, this.court.ballSize, this.court.context, this.court.courtColor);

    this.playing = true;

    // Start the updates
    window.court.step();
}

Game.prototype.point = function (player) {
    this.court.scoreboard.pointWon(player);

    if (player.score == 21) {
        this.end(player);
    } else {
        // Create a new ball in the center of the court - Moving
        this.court.ball = new Ball(this.court, this.court.ballSize, this.court.context, this.court.courtColor);
    }
}

Game.prototype.end = function (winner) {
    console.log(winner.name + " wins");
    // TODO find this sound then enable
//    this.gameWon.play();
    this.playing = false;
    // Stop the Animation
    // TODO
//    cancelRequestAnimFrame(init);
}

window.animater = (function () {
    return  window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        function (callback) {
            window.setTimeout(callback, 1000 / 60);
        };
})();


window.keysDown = {};

window.addEventListener("keydown", function (event) {
    // Mark this key in the keysDown array as pressed
    window.keysDown[event.keyCode] = true;
});

window.addEventListener("keyup", function (event) {
    // remove this key from the keysDown array
    delete window.keysDown[event.keyCode];
});