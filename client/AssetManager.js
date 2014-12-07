function AssetManager() {
	this.cache = {};
	this.downloaded = 0;
	this.queue = [];
}

AssetManager.prototype.processQueue = function() {
	var currentThis = this;
	if(this.queue.length === 0) return this.completed();
	for(var i = 0; i < this.queue.length; ++i) {
		var newImage = new Image();
		newImage.addEventListener("load", function() {
			++currentThis.downloaded;
			if(currentThis.downloaded == currentThis.queue.length) {
				currentThis.completed();
			}
		});
		newImage.addEventListener("error", function() {
			++currentThis.downloaded;
			if(currentThis.downloaded == this.queue.length) {
				currentThis.completed();
			}
		});
		newImage.src = this.queue[i];
		currentThis.cache[this.queue[i]] = newImage;
	}
}

AssetManager.prototype.insertQueue = function(url) {
	this.queue.push(url);
}

AssetManager.prototype.completed = function() {
	this.callback();
}

AssetManager.prototype.setCallback = function(callback) {
	this.callback = callback;
}

AssetManager.prototype.getAsset = function(url) {
	return this.cache[url];
}