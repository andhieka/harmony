
function SoundEngine () {
	this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
	this.frequency = {
		'C': 261.63,
		'C#': 277.18,
		'D': 293.66,
		'D#': 311.13,
		'E': 329.63,
		'F': 349.23,
		'F#': 369.99,
		'G': 392.00,
		'G#': 415.30,
		'A': 440.00,
		'A#': 466.16,
		'B': 493.88
	}
	this.player = { };
	this.setupPlayers();
}

SoundEngine.prototype.playNotes = function(notes) {
	for (var i = 0; i < notes.length; i++) {
		this.player[notes[i]].play();
	}
};

SoundEngine.prototype.setupPlayers = function() {
	var ctx = this.audioCtx;
	var freq = this.frequency;
	for (var key in freq) {
		if (freq.hasOwnProperty(key)) {
			this.player[key] = new SoundPlayer(ctx, freq[key]);
		}
	}
};

