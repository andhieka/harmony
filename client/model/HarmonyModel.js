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
		throw "Cannot add player after game has started."
	} else {
		this.players.push(player);
	}
};

HarmonyModel.prototype.setKey = function(key) {
	this.board.setKey(key);
};

// methods after game start

HarmonyModel.prototype.startGame = function() {
	this.gameStatus = GAME_STARTED;
	this.activePlayer = Math.random() * this.players.length;
};

HarmonyModel.prototype.getBoard = function() {
	return this.board;
};

// methods to end game

HarmonyModel.prototype.stopGame = function() {
	this.gameStatus = GAME_STOPPED;

};

