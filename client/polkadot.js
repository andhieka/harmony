var polkadot;
var polkadotTop = 0;
var POLKADOT_TOP_OFFSET = 117;
var POLKADOT_LEFT_OFFSET = 306;
var bg;
function startPolkadotBackground() {
	polkadot = document.getElementById('polkadot');
	bg = new Image();
	bg.src = 'background.png';
	bg.addEventListener('load', function() {
		var loop = setInterval(function() {
			polkadot.getContext('2d').drawImage(bg, POLKADOT_LEFT_OFFSET, POLKADOT_TOP_OFFSET, 1024, 600, 0, polkadotTop, 1024, 640);
			polkadot.getContext('2d').drawImage(bg, POLKADOT_LEFT_OFFSET, POLKADOT_TOP_OFFSET, 1024, 600, 0, polkadotTop - 640, 1024, 640);
			polkadot.getContext('2d').drawImage(bg, POLKADOT_LEFT_OFFSET, POLKADOT_TOP_OFFSET, 1024, 600, 0, polkadotTop + 640, 1024, 640);
			polkadotTop += 1.7;
			if(polkadotTop > 640) polkadotTop = 0;
			
		}, 1000/60);
	});
}