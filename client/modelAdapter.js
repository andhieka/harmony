//Adapt from Model

function ModelAdapter() {

}


ModelAdapter.prototype.getPlayersInformation = function() {
	// return array of objects containing:
	// player ID, player name, score, active player
	// format:
	return [
		{"id": 1,
		"username": "nick",
		"active": false,
		"score": 25},
		{"id": 3,
		"username": "andrea",
		"active": true,
		"score": 15},
		{"id": 7,
		"username": "mickey",
		"active": false,
		"score": 37},
	];
}

ModelAdapter.prototype.getTileAt = function(row, col) {
	//return the tile located at row, col of boardgame
	//or return emptyNote
	return new NoteTile('F#');
}