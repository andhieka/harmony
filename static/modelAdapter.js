//Adapt from Model

function ModelAdapter(harmonyModel) {
	this.harmonyModel = harmonyModel;
}


ModelAdapter.prototype.getPlayersInformation = function() {
	// return array of objects containing:
	// player ID, player name, score, active player
	// format:
	var playersInformation = [];
	var players = harmonyModel.getPlayers();
	for (var i = 0; i < players.length; ++i) {
		playersInformation.push({
			"id": players[i].getId(),
			"username": players[i].getName();
			"active": harmonyModel.isActivePlayer(players[i]),
			"score": players[i].getScore();
		});
	}


	return playersInformation;
}

ModelAdapter.prototype.getTileAt = function(row, col) {
	//return the tile located at row, col of boardgame
	//or return emptyNote
	return new NoteTile('F#');
}