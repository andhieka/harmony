var INVALID_SEQUENCE = "INVALID_SEQUENCE";

function ChordAnalyzer(key) {
	this.key = key;
	this.notes = ['C', 'C#', 'D', 'D#', 'E', 'F',
				  'F#', 'G', 'G#', 'A', 'A#', 'B'];
}

// score is 1 if chord is valid, 0 otherwise
ChordAnalyzer.prototype.analyze = function(streak) {
	var seq = [];
	for (var i = 0; i < streak.length; i++) {
		var idx = this.getIndex(streak[i]);
		if (seq.indexOf(idx) == -1) { //allow repetition of notes
			seq.push(idx);
		}
	}
	seq.sort(function(a, b) { return a - b; });
	var chord = this.checkSequence(seq);
	var score = (chord == INVALID_SEQUENCE) ? 0 : 1;
	return new Result(score, chord);
};

ChordAnalyzer.prototype.checkSequence = function(sequence) {

	//if (arraysEqual(sequence, [1, 4])) return "Minor third";
	if (arraysEqual(sequence, [1, 5])) return "Major third";
	if (arraysEqual(sequence, [1, 8])) return "Perfect fifth";
	if (arraysEqual(sequence, [1, 10])) return "Minor third";
	if (arraysEqual(sequence, [1, 6])) return "Perfect fourth";
	if (arraysEqual(sequence, [3, 10])) return "Perfect fifth";
	if (arraysEqual(sequence, [6, 10])) return "Major third";
	if (arraysEqual(sequence, [8, 12])) return "Major third";
	if (arraysEqual(sequence, [5, 10])) return "Perfect fourth";
	if (arraysEqual(sequence, [5, 12])) return "Perfect fifth";
	if (arraysEqual(sequence, [5, 8])) return "Minor third";
	if (arraysEqual(sequence, [3, 6])) return "Minor third";
	if (arraysEqual(sequence, [1, 5, 8])) return "I major";
	if (arraysEqual(sequence, [3, 6, 10])) return "II minor";
	if (arraysEqual(sequence, [5, 8, 12])) return "III minor";
	if (arraysEqual(sequence, [1, 6, 10])) return "IV major";
	if (arraysEqual(sequence, [3, 8, 12])) return "V major";
	if (arraysEqual(sequence, [1, 5, 10])) return "VI minor";
	if (arraysEqual(sequence, [3, 6, 12])) return "VII diminished";

	// seventh chords
	//if (arraysEqual(sequence, [1, 5, 8, 12])) return "I maj7";
	
	return INVALID_SEQUENCE;
};

ChordAnalyzer.prototype.getIndex = function(note) {
	var noteIndex = this.notes.indexOf(note);
	var baseIndex = this.notes.indexOf(this.key);
	if (noteIndex >= baseIndex) {
		return noteIndex - baseIndex + 1;
	} else {
		return (11 - baseIndex) + 1 + noteIndex + 1;
	}
};

function arraysEqual(a, b) {
	if (a === b) return true;
	if (a == null || b == null) return false;
	if (a.length != b.length) return false;

	for (var i = 0; i < a.length; ++i) {
		if (a[i] !== b[i]) return false;
	}
	return true;
}