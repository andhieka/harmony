function MouseIO(canvasDOM, view) {
	this.canvasDOM = canvasDOM;
	this.view = view;
}

MouseIO.prototype.initializeMouseListener = function() {
	canvasDOM.addEventListener('mousemove', this);
	canvasDOM.addEventListener('mousedown', this);
}

MouseIO.prototype.handleEvent = function(e) {
	if (e.type == 'mousedown') {
		this.checkFocusWithCardDeck(e.x - this.canvasDOM.leftOffset, e.y - this.canvasDOM.topOffset);
		this.checkFocusWithTiles(e.x - this.canvasDOM.leftOffset, e.y - this.canvasDOM.topOffset);
	}
}

MouseIO.prototype.checkFocusWithCardDeck = function(left, top) {
	if (this.isInsideBoundingBox(left, top, CARDDECK_LEFT, CARDDECK_TOP, CARDDECK_LEDGE_WIDTH, GAMEBOARD_TILEWIDTH)) {
		for (var i = 0; i < this.view.
	}
}

MouseIO.prototype.isInsideBoundingBox = function(point_left, point_top, box_left, box_top, box_width, box_height) {
	return (box_left <= point_left && box_left + box_width >= point_left
		&& box_top <= point_top && box_top + box_height >= point_top);
}