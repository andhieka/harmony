var NOTE_DURATION = 1500; //millis

function SoundPlayer(audioCtx, frequency) {
	var osc = audioCtx.createOscillator();
	osc.frequency.value = frequency;
	osc.type = osc.SQUARE;
	osc.start(0);

	var vol = audioCtx.createGain();
	vol.gain.value = 0;

	osc.connect(vol);
	vol.connect(audioCtx.destination);

	this.ctx = audioCtx;
	this.vol = vol;
}

SoundPlayer.prototype.play = function() {
	this.vol.gain.value = 0.3;
	function turnOff(x) {
		return function() {
			x.gain.value = 0;
		}
	}
	setTimeout(turnOff(this.vol), NOTE_DURATION);
};

