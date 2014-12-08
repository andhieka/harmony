var GAMEBOARD_TOP = 20;
var GAMEBOARD_LEFT = 270;
var GAMEBOARD_SIDELENGTH = 500;
var GAMEBOARD_DIMENSION = 8;
var GAMEBOARD_TILEWIDTH = GAMEBOARD_SIDELENGTH / GAMEBOARD_DIMENSION;
var NOTETILE_FONT_RATIO = 0.6;
var NOTETILE_MARGIN_LEFT = 10;
var NOTETILE_MARGIN_TOP = 10;
var TILE_COLOR = "rgba(205,224,94,0.85)";
var TILE_STROKE_COLOR = "rgba(40, 40, 40, 0.9)";
var GRID_HIGH_COLOR = "rgba(250, 0, 0, 0.07)";
//var GRID_MID_COLOR = "rgba(200, 200, 120, 0.9)";
//var GRID_LOW_COLOR = "rgba(0, 10, 200, 0.9)";
var GRID_GLASS_COLOR = "rgba(255,255,255,0.6)";
//var GRID_HIGH_COLOR = {'xoffset': 242, 'yoffset': 392};
//var GRID_MID_COLOR = {'xoffset': 0, 'yoffset': 0};
var GRID_SIZE = 45;
var CARDDECK_TOP = 560;
var CARDDECK_LEFT = 270;
var CARDDECK_COLOR = "rgba(102, 58, 4, 0.9)";
var CARDDECK_LEG_WIDTH = 30;
var CARDDECK_LEG_HEIGHT = 70;
var CARDDECK_LEDGE_WIDTH = 510;
var CARDDECK_LEDGE_HEIGHT = 5;
var DECKCARD_MARGIN = 0;
var TIME_ALLOWED = 10;

function View(graphics, LeaderBoardDOM, modelAdapter){
	this.modelAdapter = modelAdapter;
	this.graphics = graphics;
	this.LeaderBoardDOM = LeaderBoardDOM;
	this.gameBoardView = new GameBoardView(GAMEBOARD_LEFT, GAMEBOARD_TOP, GAMEBOARD_SIDELENGTH, GAMEBOARD_DIMENSION);
	this.cardDeck = new CardDeck(CARDDECK_LEFT, CARDDECK_TOP);
	this.leaderBoard = new LeaderBoard();
}

View.prototype.setCurrentUserID = function(currentUserID) {
	this.leaderBoard.setCurrentUserID(currentUserID);
}

View.prototype.initialize = function() {
	this.showGameBoard(this.graphics);
	this.showCardDeck(this.graphics);
	this.showLeaderBoard(this.leaderBoardDOM);
}

View.prototype.showGameBoard = function() {
	this.gameBoardView.initialize(this.graphics);
}

View.prototype.showCardDeck = function() {
	this.cardDeck.drawDeck(this.graphics);
}

View.prototype.showLeaderBoard = function() {
	this.leaderBoard.updateLeaderBoard(this.modelAdapter, this.LeaderBoardDOM);
}


function GameBoardView(left, top, sideLength, dimension) {
	this.left = left;
	this.top = top;
	this.sideLength = sideLength;
	this.dimension = dimension;
	this.color = TILE_STROKE_COLOR;
	this.tileWidth = this.sideLength / this.dimension;
}

GameBoardView.prototype.setColor = function(color) {
	this.color = color;
}

GameBoardView.prototype.initialize = function(graphics) {
	this.drawGrid(graphics);
	this.markScoresOnGrid(graphics);
}

GameBoardView.prototype.drawGrid = function(graphics) {
	graphics.strokeStyle = this.color;
	for (var i = 0; i <= this.dimension; ++i) {
		graphics.moveTo(this.left + this.tileWidth * i, this.top);
		graphics.lineTo(this.left + this.tileWidth * i, this.top + this.sideLength);

		graphics.moveTo(this.left, this.top + this.tileWidth * i);
		graphics.lineTo(this.left + this.sideLength, this.top + this.tileWidth * i);
	}
	graphics.stroke();
}

GameBoardView.prototype.markScoresOnGrid = function(graphics) {
	for(var i = 0; i < this.dimension; ++i) {
		for(var j = 0; j < this.dimension; ++j) {
			this.drawRect(i, j, TILE_STROKE_COLOR, GRID_GLASS_COLOR, graphics);
		}
	}
	for(var i = 0; i < this.dimension; ++i) {
		//this.drawRect(i, i, TILE_STROKE_COLOR, GRID_HIGH_COLOR, graphics);
		//this.drawRect(i, this.dimension-i-1, TILE_STROKE_COLOR, GRID_HIGH_COLOR, graphics);
		this.drawRect(i, 0, TILE_STROKE_COLOR, GRID_HIGH_COLOR, graphics);
		this.drawRect(0, i, TILE_STROKE_COLOR, GRID_HIGH_COLOR, graphics);
		this.drawRect(this.dimension-1, i, TILE_STROKE_COLOR, GRID_HIGH_COLOR, graphics);
		this.drawRect(i, this.dimension-1, TILE_STROKE_COLOR, GRID_HIGH_COLOR, graphics);
	}
}


GameBoardView.prototype.drawRect = function(row, col, strokeColor, fillColor, graphics) {
	graphics.fillStyle = fillColor;
	graphics.fillRect(this.left + this.tileWidth * col, this.top + this.tileWidth * row, this.tileWidth, this.tileWidth);
	graphics.strokeStyle = strokeColor;
	graphics.strokeRect(this.left + this.tileWidth * col, this.top + this.tileWidth * row, this.tileWidth, this.tileWidth);
}
/*
GameBoardView.prototype.drawRect = function(row, col, strokeColor, type, graphics) {
	var tile = assetManager.getAsset('glass.jpg');
	//graphics.drawImage(tile, type.xoffset, type.yoffset, GRID_SIZE, GRID_SIZE, this.left + this.tileWidth * col, this.top + this.tileWidth * row, this.tileWidth, this.tileWidth);

}
*/

GameBoardView.prototype.drawTiles = function(graphics) {
	for (var i = 0; i < this.dimension; ++i) {
		for(var j = 0; j < this.dimension; ++j) {
			if(gameBoard.getContent(i,j) == false) continue;
			this.drawTile(i, j, new NoteTile(gameBoard.getContent(i,j)), graphics);
		}
	}
}

GameBoardView.prototype.drawTile = function(row, col, tile, graphics) {
	tile.drawSelf(this.left + col * this.tileWidth, this.top + row * this.tileWidth, this.tileWidth, graphics);
}

function NoteTile(key) {
	this.key = key.toUpperCase();
	this.tileColor = TILE_COLOR;
	this.fontColor = TILE_STROKE_COLOR;
	this.font = "times";
}

NoteTile.prototype.setTileColor = function(color) {
	this.tileColor = color;
}

NoteTile.prototype.setFont = function(font) {
	this.font = font;
}

NoteTile.prototype.setFontColor = function(color) {
	this.fontColor = color;
}

NoteTile.prototype.drawSelf = function(left, top, sideLength, graphics) {
	var size = sideLength * NOTETILE_FONT_RATIO;
	graphics.fillStyle = this.tileColor;
	graphics.fillRect(left, top, sideLength, sideLength);
	graphics.strokeStyle = TILE_STROKE_COLOR;
	graphics.strokeRect(left, top, sideLength, sideLength);
	graphics.fillStyle = this.fontColor;
	graphics.font = size + "px " + this.font;
	graphics.fillText(this.key, left + NOTETILE_MARGIN_LEFT, top + size + NOTETILE_MARGIN_TOP);
}


function CardDeck(left, top) {
	this.cardStack = [];
	this.left = left;
	this.top = top;
}

CardDeck.prototype.pushTile = function(tile) {
	this.cardStack.push(tile);
}


CardDeck.prototype.drawDeck = function(graphics) {
	graphics.fillStyle = CARDDECK_COLOR;
	graphics.strokeStyle = TILE_STROKE_COLOR;
	graphics.fillRect(this.left - CARDDECK_LEG_WIDTH, this.top, CARDDECK_LEG_WIDTH, CARDDECK_LEG_HEIGHT);
	graphics.strokeRect(this.left - CARDDECK_LEG_WIDTH, this.top, CARDDECK_LEG_WIDTH, CARDDECK_LEG_HEIGHT);

	graphics.fillRect(this.left + CARDDECK_LEDGE_WIDTH, this.top, CARDDECK_LEG_WIDTH, CARDDECK_LEG_HEIGHT);
	graphics.strokeRect(this.left + CARDDECK_LEDGE_WIDTH, this.top, CARDDECK_LEG_WIDTH, CARDDECK_LEG_HEIGHT);

	graphics.fillRect(this.left, this.top + GAMEBOARD_SIDELENGTH / GAMEBOARD_DIMENSION, CARDDECK_LEDGE_WIDTH, CARDDECK_LEDGE_HEIGHT);
	graphics.strokeRect(this.left, this.top + GAMEBOARD_SIDELENGTH / GAMEBOARD_DIMENSION, CARDDECK_LEDGE_WIDTH, CARDDECK_LEDGE_HEIGHT);
}

CardDeck.prototype.drawTiles = function(cardStack, graphics) {
	for (var i = 0; i < cardStack.length; ++i) {
		var nt = new NoteTile(CHOICES[cardStack[i]])
		nt.drawSelf(this.left + i * (DECKCARD_MARGIN + GAMEBOARD_SIDELENGTH / GAMEBOARD_DIMENSION), this.top, GAMEBOARD_SIDELENGTH / GAMEBOARD_DIMENSION, graphics);
	}
}


function LeaderBoard() {
	this.currentUserID = 0;
}

LeaderBoard.prototype.setCurrentUserID = function(currentUserID) {
	this.currentUserID = currentUserID;
}

LeaderBoard.prototype.updateLeaderBoard = function(modelAdapter, DOM) {
	this.clearLeaderBoard(DOM);
	var playersInformation = modelAdapter.getPlayersInformation();
	this.displayOnLeaderBoard(playersInformation, DOM);
}

LeaderBoard.prototype.clearLeaderBoard = function(DOM) {
	while(DOM.firstChild) {
		DOM.removeChild(DOM.firstChild);
	}
}

LeaderBoard.prototype.displayOnLeaderBoard = function(playersInformation, DOM) {
	this.sortPlayersInformation(playersInformation);
	for(var i = 0; i < playersInformation.length; ++i) {
		LeaderBoard.prototype.appendToBoard(playersInformation[i], DOM);
	}
}

LeaderBoard.prototype.sortPlayersInformation = function(playersInformation) {
	for(var i = 0; i < playersInformation.length; ++i) {
		var j = i;
		while(j > 0 && playersInformation[j].score > playersInformation[j-1].score) {
			var temp = playersInformation[j];
			playersInformation[j] = playersInformation[j-1];
			playersInformation[j-1] = temp;
			--j;
		}
	}
}

LeaderBoard.prototype.appendToBoard = function(playerInformation, DOM) {
	DOM.innerHTML += '<div id="player_info" '
				+ (playerInformation.active ? 'class="activePlayer"' : '') + '>' 
				+ '<div id="username"> ' + playerInformation.username + ' </div>'
				+ '<div id="score">' + playerInformation.score + '</div>'
				+ '</div>';
}

function TimerDisplay(DOM) {
	this.DOM = DOM;
	this.countingDown = false;
	this.loop = {};
}

TimerDisplay.prototype.countDown = function() {
	if(this.countingDown) return;
	var innerThis = this;
	this.startingTime = Date.now();
	this.countingDown = true;
	this.loop = setInterval(function() {
		var timeElapsed = Date.now() - innerThis.startingTime;
		var timeRemaining = TIME_ALLOWED - timeElapsed/1000;
		if(timeRemaining <= 0) {
			timeRemaining = 0;
			clearInterval(innerThis.loop);
			innerThis.countingDown = false;
		}
		innerThis.DOM.innerHTML = parseInt(timeRemaining);
	})
}

TimerDisplay.prototype.reset = function() {
	this.countingDown = false;
	clearInterval(this.loop);
}
