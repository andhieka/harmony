var GAMEBOARD_TOP = 20;
var GAMEBOARD_LEFT = 270;
var GAMEBOARD_SIDELENGTH = 500;
var GAMEBOARD_DIMENSION = 8;
var NOTETILE_FONT_RATIO = 0.6;
var NOTETILE_MARGIN_LEFT = 10;
var NOTETILE_MARGIN_TOP = 10;
var TILE_COLOR = "rgba(212,132,35,1)";
var TILE_STROKE_COLOR = "rgba(40, 40, 40, 0.9)";
var GRID_HIGH_COLOR = "rgba(240, 90, 0, 0.9)";
var GRID_MID_COLOR = "rgba(200, 200, 120, 0.9)";
var GRID_LOW_COLOR = "rgba(0, 10, 200, 0.9)";
var CARDDECK_TOP = 560;
var CARDDECK_LEFT = 270;
var CARDDECK_COLOR = "rgba(200, 200, 10, 0.9)";
var CARDDECK_LEG_WIDTH = 30;
var CARDDECK_LEG_HEIGHT = 70;
var CARDDECK_LEDGE_WIDTH = 500;
var CARDDECK_LEDGE_HEIGHT = 5;
var DECKCARD_MARGIN = 2;

function View(graphics){
	this.graphics = graphics;

}

View.prototype.showGameBoard = function() {

}

View.prototype.showScoreBoard = function() {

}

View.prototype.showCardDeck = function() {

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
		this.drawRect(i, i, TILE_STROKE_COLOR, GRID_HIGH_COLOR, graphics);
		this.drawRect(i, this.dimension-i-1, TILE_STROKE_COLOR, GRID_HIGH_COLOR, graphics);
		this.drawRect(i, 0, TILE_STROKE_COLOR, GRID_HIGH_COLOR, graphics);
		this.drawRect(0, i, TILE_STROKE_COLOR, GRID_HIGH_COLOR, graphics);
		this.drawRect(this.dimension-1, i, TILE_STROKE_COLOR, GRID_HIGH_COLOR, graphics);
		this.drawRect(i, this.dimension-1, TILE_STROKE_COLOR, GRID_HIGH_COLOR, graphics);
	}
	for(var i = 1; i < this.dimension - 1; ++i) {
		this.drawRect(i, 1, TILE_STROKE_COLOR, GRID_MID_COLOR, graphics);
		this.drawRect(1, i, TILE_STROKE_COLOR, GRID_MID_COLOR, graphics);
		this.drawRect(this.dimension-2, i, TILE_STROKE_COLOR, GRID_MID_COLOR, graphics);
		this.drawRect(i, this.dimension-2, TILE_STROKE_COLOR, GRID_MID_COLOR, graphics);
	}
}

GameBoardView.prototype.drawRect = function(row, col, strokeColor, fillColor, graphics) {
	graphics.fillStyle = fillColor;
	graphics.fillRect(this.left + this.tileWidth * col, this.top + this.tileWidth * row, this.tileWidth, this.tileWidth);
	graphics.strokeStyle = strokeColor;
	graphics.strokeRect(this.left + this.tileWidth * col, this.top + this.tileWidth * row, this.tileWidth, this.tileWidth);
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

CardDeck.prototype.drawTiles = function(graphics) {
	for (var i = 0; i < this.cardStack.length; ++i) {
		this.cardStack[i].drawSelf(this.left + i * (DECKCARD_MARGIN + GAMEBOARD_SIDELENGTH / GAMEBOARD_DIMENSION), this.top, GAMEBOARD_SIDELENGTH / GAMEBOARD_DIMENSION, graphics);
	}
}


