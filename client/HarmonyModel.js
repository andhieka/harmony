var GAME_INACTIVE = 0;
var GAME_STARTED = 1;
var GAME_STOPPED = 2;
var DEFAULT_KEY = 'C';

function HarmonyModel() {
	this.board = new Board(DEFAULT_KEY);
	this.gameStatus = GAME_INACTIVE; 
	this.players = [];
}

// methods before game start
HarmonyModel.prototype.addPlayer = function(player) {
	if (this.gameStatus != GAME_INACTIVE) {
		throw new Error("Cannot add player after game has started.");
	} else {
		this.players.push(player);
	}
};

HarmonyModel.prototype.setKey = function(key) {
	if (this.gameStatus != GAME_INACTIVE) {
		throw new Error("Cannot change key after game has started.");
	}
	this.board.setKey(key);
};

HarmonyModel.prototype.startGame = function() {
	if (this.gameStatus != GAME_INACTIVE) {
		throw new Error("Game has already started.");
	}
	this.gameStatus = GAME_STARTED;
	this.activePlayer = Math.random() * this.players.length;
};


// methods after game start
HarmonyModel.prototype.isActivePlayer = function(player) {
	// body...
};

HarmonyModel.prototype.getPlayers = function() {
	return this.players;
};

HarmonyModel.prototype.placeCard = function(row, col, card) {
	this.board.placeCard(row, col, card);
};


HarmonyModel.prototype.getBoard = function() {
	return this.board;
};


// methods to end game
HarmonyModel.prototype.stopGame = function() {
	this.gameStatus = GAME_STOPPED;

};

