var myView;
var display;

document.addEventListener("DOMContentLoaded", function() {
	startPolkadotBackground();
	myView = new GameBoardView(GAMEBOARD_LEFT, GAMEBOARD_TOP, GAMEBOARD_SIDELENGTH, GAMEBOARD_DIMENSION);
	display = document.getElementById('display');
	var t = new NoteTile('C');
	var s = new NoteTile('E#');
	myView.initialize(display.getContext('2d'));
	myView.drawTile(0,0,t,display.getContext('2d'));
	myView.drawTile(4,5,s,display.getContext('2d'));

	var deck = new CardDeck(CARDDECK_LEFT, CARDDECK_TOP);
	deck.drawDeck(display.getContext('2d'));
	deck.pushTile(t);
	deck.pushTile(t);
	deck.pushTile(s);
	deck.drawTiles(display.getContext('2d'));
})