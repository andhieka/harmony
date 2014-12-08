var polkadot;
var polkadotTop = 0;
var POLKADOT_TOP_OFFSET = 117;
var POLKADOT_LEFT_OFFSET = 306;
var bg;
var loopPolkadot;
function startPolkadotBackground() {
	polkadot = document.getElementById('polkadot');
	bg = assetManager.getAsset('background.png');
	loopPolkadot = setInterval(function() {
		polkadot.getContext('2d').drawImage(bg, POLKADOT_LEFT_OFFSET, POLKADOT_TOP_OFFSET, 1024, 600, 0, polkadotTop, 1024, 640);
		polkadot.getContext('2d').drawImage(bg, POLKADOT_LEFT_OFFSET, POLKADOT_TOP_OFFSET, 1024, 600, 0, polkadotTop - 640, 1024, 640);
		polkadot.getContext('2d').drawImage(bg, POLKADOT_LEFT_OFFSET, POLKADOT_TOP_OFFSET, 1024, 600, 0, polkadotTop + 640, 1024, 640);
		polkadotTop += 1.0;
		if(polkadotTop > 640) polkadotTop = 0;
	}, 1000/60);

}