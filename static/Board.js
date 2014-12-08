
var BOARD_WIDTH = 8;
var BOARD_HEIGHT = 8;

function Board(key) {
	this.board = new Array(BOARD_HEIGHT);
	for (var i = 0; i < BOARD_HEIGHT; i++) {
		this.board[i] = new Array(BOARD_WIDTH);
	}
	this.setKey(key);

	var rmedian = Math.floor((BOARD_HEIGHT-1)/2);
	var cmedian = Math.floor((BOARD_WIDTH-1)/2);
	this.board[rmedian][cmedian] = this.key;
}


Board.prototype.getContent = function(row, col) {
	//return false if empty!!!
	if(this.board[row][col] === undefined) return false;
	return this.board[row][col];
}

// Methods for initialization
Board.prototype.setKey = function(key) {
	this.key = key;
	this.analyzer = new ChordAnalyzer(key);
};

// places card at the specified location
// returns the maximum score possible if the placement is successful
Board.prototype.placeCard = function(row, col, card) {
	if (this.board[row][col] != undefined) {
		return false;
	}
	if (!this.isValidPosition(row, col)) {
		return false;
	} 

	//Put card and see if it generates any points
	this.board[row][col] = card;
	var hStreak = this.getHorizontalStreak(row, col);
	var vStreak = this.getVerticalStreak(row, col);
	var hResult = this.analyzer.analyze(hStreak);
	var vResult = this.analyzer.analyze(vStreak);

	if (hResult.message != INVALID_SEQUENCE) {
		soundEngine.playNotes(hStreak);
	} else {
		if (vResult.message != INVALID_SEQUENCE) {
			soundEngine.playNotes(vStreak);
		}
	}

	//if it does not generate any point, cancel move
	if (hResult.getScore() == 0 && vResult.getScore() == 0) {
		this.board[row][col] = undefined;
	}
	return [hResult, vResult];
};

Board.prototype.isValidPosition = function(row, col) {
	if (!this.hasNeighbour(row, col)) {
		return false;
	}
	return true;
};

Board.prototype.hasNeighbour = function(row, col) {
	if (col > 0 && this.board[row][col-1] != undefined) {
		return true;
	}
	if (col < BOARD_WIDTH - 1 && this.board[row][col+1] != undefined) {
		return true;
	}
	if (row > 0 && this.board[row-1][col] != undefined) {
		return true;
	}
	if (row < BOARD_HEIGHT - 1 && this.board[row+1][col] != undefined) {
		return true;
	}
	return false;
};

Board.prototype.getHorizontalStreak = function(row, col) {
	var streak = [];
	var i = col;
	while (i >= 0 && this.board[row][i] != undefined) {
		streak.push(this.board[row][i]);
		i--;
	}
	i = col+1;
	while (i < BOARD_WIDTH && this.board[row][i] != undefined) {
		streak.push(this.board[row][i]);
		i++;
	}
	return streak;
};

Board.prototype.getVerticalStreak = function(row, col) {
	var streak = [];
	var i = row;
	while (i >= 0 && this.board[i][col] != undefined) {
		streak.push(this.board[i][col]);
		i--;
	}
	i = row + 1;
	while (i < BOARD_HEIGHT && this.board[i][col] != undefined) {
		streak.push(this.board[i][col]);
		i++;
	}
	return streak;
};

Board.prototype.print = function() {
	for (var i = 0; i < BOARD_HEIGHT; i++) {
		var row = "";
		for (var j = 0; j < BOARD_WIDTH; j++) {
			var x = this.board[i][j];
			row += (x == undefined) ? '-' : x;
			row += " ";
		}
		console.log(row);
	}
};

Board.prototype.toJson = function() {
	return JSON.stringify({'key': this.key, 'board': this.board});
};

Board.prototype.updateFromJson = function(json_object) {
	var obj = JSON.parse(json_object);
	this.key = obj.key;
	this.board = obj.board;
};

function testBoard() {
	var x = new Board('C');
	assert(x.placeCard(3, 4, 'E')[0].getScore() == 1);
	assert(x.placeCard(4, 3, 'G')[1].getScore() == 1);
	assert(x.placeCard(3, 2, 'G')[0].getScore() == 1);
	var tmp = x.placeCard(4, 4, 'C');
	assert(tmp[0].getScore() == 1);
	assert(tmp[1].getScore() == 1);
	assert(x.placeCard(5, 4, 'A')[1].getScore() == 1);
	console.log("Test ended");
}