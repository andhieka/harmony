
function Result(score, message) {
	this.score = score;
	this.message = message;
}

Result.prototype.getScore = function() {
	return this.score;
};

Result.prototype.getMessage = function() {
	return this.message;
};

