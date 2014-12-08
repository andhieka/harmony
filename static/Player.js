function Player(id, name) {
	this.score = 0;
	this.name = name;
	this.id = id;
	this.active = false;
}

Player.prototype.getId = function() {
	return this.id;
};

Player.prototype.getName = function() {
	return this.name;
};

Player.prototype.getScore = function() {
	return this.score;
};

Player.prototype.addScore = function(score) {
	this.score += score;
};

Player.prototype.setActive = function(activity) {
	this.active = activity;
}

Player.prototype.isActive = function() {
	return this.active;
}