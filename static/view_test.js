var myView;
var display;
var assetManager;
var assetQueue = ['background.png'];
var leaderBoard;
var timerBoard;

document.addEventListener("DOMContentLoaded", function() {
	display = document.getElementById('display');
	leaderBoard = document.getElementById('leaderboard');
	timerBoard = document.getElementById('timer');
	modelAdapter = new ModelAdapter(new HarmonyModel());
	assetManager = new AssetManager();
	for(var i = 0; i < assetQueue.length; ++i) {
		assetManager.insertQueue(assetQueue[i]);
	}
	assetManager.setCallback(randomTest);
	assetManager.processQueue();
})

function randomTest(){
	startPolkadotBackground();
	myView = new View(display.getContext('2d'), leaderboard, modelAdapter);
	myView.initialize();
	var choices = ['C', 'C#', 'E', 'F', 'G', 'D#', 'A', 'B', 'F#'];
	for(var i = 0; i < 9; ++i) {
		if(Math.random() > 0.5) myView.gameBoardView.drawTile(((i*37)%41)%8, ((i*29)%83)%8, new NoteTile(choices[i]), myView.graphics);
		if(Math.random() > 0.5) {
			myView.cardDeck.pushTile(new NoteTile(choices[i]));
		}
		myView.cardDeck.drawTiles(myView.graphics);
	}
	var timerdisplay = new TimerDisplay(timerBoard);
	timerdisplay.countDown();
}