//Client Side of the story
var GET_PLAYER_INFO_URL = "/api/player/info";
var GET_ROOM_INFORMATION_URL = "/api/room/room_number";
var UPDATE_COMMAND_STACK_URL = "";
var REGISTER_MOVEMENT_URL = "";

function AJAXCall(url) {
	var request = new XMLHttpRequest();
	request.open("GET", url, false);
	//request.send(null);
	if (request.status === 200) {
		return JSON.parse(request.responseText)
	}
}


function PlayerInformationAJAX() {
	console.log("PlayerInformationAJAX needs to be implemented");
	this.sendRequest();
}

PlayerInformationAJAX.prototype.sendRequest = function() {
	this.data = AJAXCall(GET_PLAYER_INFO_URL);
}

PlayerInformationAJAX.prototype.getID = function() {
	//
	return 1;
}

PlayerInformationAJAX.prototype.getUserName = function() {
	//
	return "baba";
}

PlayerInformationAJAX.prototype.getRoomNumber = function() {
	//
	return 2;
}


function RoomInformationAJAX(roomNumber) {
	console.log("RoomInformationAJAX needs to be implemented");
	this.roomNumber = roomNumber;
	this.sendRequest();
}

RoomInformationAJAX.prototype.sendRequest = function() {
	this.data = AJAXCall(GET_ROOM_INFORMATION_URL + "/" + this.roomNumber);
}

RoomInformationAJAX.prototype.getPlayers = function() {
	//
	return [];
}

RoomInformationAJAX.prototype.getKey = function() {
	//
	return 'C';
}

RoomInformationAJAX.prototype.getCommandStack = function() {
	//
	return [];
}


var CHOICES = ['C', 'C', 'D', 'D', 'E', 'G', 'G', 'F', 'F', 'A', 'A', 'B'];
var NUM_DECK = 8;
var PRIME_RANDOMIZER = 313;
var PRIME_SHIFTER = 13;
var DOMDisplay;
var DOMLeaderBoard;
var DOMTimerBoard;
var view;
var model;
var gameTimer;
var assetQueue = ['background.png'];
var assetManager;
var playerList = [];
var currentPlayer = {};
var roomNumber;
var commandStack = [];
var currentActivePlayer;
var gameBoard;
var harmonyGameLoop;
var statusBar;
var selectedDeckCard;
var selectedTile;
var deckCardSelector;
var tileSelector;
var playerDeck = [];
var makeMoveButton;
var announcer;

document.addEventListener("DOMContentLoaded", function() {
	initializeGame();	
})

function initializeGame() {
	DOMDisplay = document.getElementById('display');
	DOMLeaderBoard = document.getElementById('leaderboard');
	DOMTimerBoard = document.getElementById('timer');
	tileSelector = document.getElementById('tileselector');
	deckCardSelector = document.getElementById('deckselector');
	makeMoveButton = document.getElementById('makemovebutton');
	announcer = document.getElementById('announcer');
	statusBar = document.getElementById('status');
	model = new HarmonyModel();
	view = new View(DOMDisplay.getContext('2d'), DOMLeaderBoard, new ModelAdapter(model));
	gameTimer = new TimerDisplay('DOMTimerBoard');
	assetManager = new AssetManager();
	for(var i = 0; i < assetQueue.length; ++i) {
		assetManager.insertQueue(assetQueue[i]);
	}
	assetManager.setCallback(startGameLoop);
	assetManager.processQueue();
}

function startGameLoop() {
	startPolkadotBackground();
	getInitialGameState();
	view.initialize();
	view.cardDeck.drawTiles(playerDeck, view.graphics);
	view.gameBoardView.drawTiles(view.graphics);
}

function getInitialGameState() {
	var currentPlayerInformation = new PlayerInformationAJAX();
	currentPlayer = new Player(currentPlayerInformation.getID(), currentPlayerInformation.getUserName());
	roomNumber = currentPlayerInformation.getRoomNumber();

	var roomInformation = new RoomInformationAJAX(roomNumber);
	gameBoard = new Board(roomInformation.getKey());
	initializePlayerDeck();
	registerEventListeners();
	//gameLoop();
}

function initializePlayerDeck() {
	for(var i = 0; i < NUM_DECK; ++i) {
		randomDeckGetter(i);
	}
}

function randomDeckGetter(i) {
	var curtime = Date.now();
	var mod = ((curtime % PRIME_SHIFTER)* PRIME_SHIFTER * PRIME_SHIFTER * i) % PRIME_RANDOMIZER;
	playerDeck.push(mod%12);
}

function registerEventListeners() {
	document.addEventListener('mousedown', function(e) {
		mouseDownHandler(e);
	});
	document.addEventListener('keydown', function(e){
		if(e.which == 80) {
			clearInterval(loopPolkadot);
			clearInterval(harmonyGameLoop);
		}
	});
	makeMoveButton.addEventListener('mousedown', function(e) {
		var successfulMove = makeMove(selectedTile.row, selectedTile.col, CHOICES[playerDeck[selectedDeckCard]]);
		if(successfulMove) {
			playerDeck.splice(selectedDeckCard, 1);
			randomDeckGetter(20)
			DOMDisplay.getContext('2d').clearRect(0, 0, 1024, 640);
			view.initialize();
			view.cardDeck.drawTiles(playerDeck, view.graphics);
			view.gameBoardView.drawTiles(view.graphics);
		} else {
			announcer.innerHTML = "not valid";
			announcer.style.setProperty('opacity', 1);
			setTimeout(function() {
				announcer.style.setProperty('opacity', 0);
			}, 1000);
		}
	});
}

function mouseDownHandler(e) {
	var left = e.x - DOMDisplay.offsetLeft;
	var top = e.y - DOMDisplay.offsetTop;
	if(GAMEBOARD_LEFT <= left && GAMEBOARD_SIDELENGTH + GAMEBOARD_LEFT >= left 
	&& GAMEBOARD_TOP <= top && GAMEBOARD_TOP + GAMEBOARD_SIDELENGTH >= top) {
		var row = Math.floor((top - GAMEBOARD_TOP)/GAMEBOARD_TILEWIDTH);
		var col = Math.floor((left - GAMEBOARD_LEFT)/GAMEBOARD_TILEWIDTH);
		selectedTile = {"row": row, "col": col};
		displaySelector(tileSelector, GAMEBOARD_LEFT + (col+1.4) * GAMEBOARD_TILEWIDTH, GAMEBOARD_TOP + row * GAMEBOARD_TILEWIDTH);
	}
	if(CARDDECK_LEFT <= left && CARDDECK_LEFT + CARDDECK_LEDGE_WIDTH >= left
	&& CARDDECK_TOP <= top && CARDDECK_TOP + GAMEBOARD_TILEWIDTH >= top) {
		var i = Math.floor((left - CARDDECK_LEFT)/GAMEBOARD_TILEWIDTH);
		selectedDeckCard = i;
		displaySelector(deckCardSelector, GAMEBOARD_LEFT + (i+1.39) * GAMEBOARD_TILEWIDTH, CARDDECK_TOP);
	}
}

function displaySelector(selector, left, top) {
	selector.style.setProperty('display', 'block');
	selector.style.setProperty('left', left + 'px');
	selector.style.setProperty('top', top + 'px');
}

function gameLoop() {
	harmonyGameLoop = setInterval(function(){
		var roomInformation = new RoomInformationAJAX(roomNumber);
		
		playerList = roomInformation.getPlayers();

		for(var i = 0; i < playerList.length; ++i) {
			if(playerList[i].isActive()) {
				if(currentActivePlayer !== playerList[i].getId()) {
					requestUpdateCommandStack();
					gameTimer.reset();
				}
				currentActivePlayer = playerList[i].getId();
				if(playerList[i].getId() === currentPlayer.getId()) {
					statusBar.innerHTML = "Your Turn!!";
				} else {
					statusBar.innerHTML = "Other player is moving";
				}
			}
		}
		gameTimer.countDown();
	}, 1000);
}

function requestUpdateCommandStack() {
	var commandStack = AJAXCall(UPDATE_COMMAND_STACK_URL);
	// 
	console.log("requestUpdateCommandStack needs to be implemented");
}

function makeMove(row, col, tile) {
	if(/*currentActivePlayer === currentPlayer.getId()*/ true) {
		commandStack.push({"row": row, "col": col, "tile": tile});
		var result = gameBoard.placeCard(row, col, tile);
		var valid = false;
		var allMessages = "";
		for (var i = 0; i < result.length; i++) {
			if (result[i].message !== INVALID_SEQUENCE) {
				currentPlayer.addScore(result[i].score);
				allMessages += result[i].getMessage() + "<br>";
				valid = true;
			}
		}
		if(valid) {
			displayToUser(allMessages);
			registerMovementToServer();
			return true;
		} else {
			return false;
		}
	} else return false;
}

function registerMovementToServer() {
	var movement = parseMovementToURL();
	var request = AJAXCall(REGISTER_MOVEMENT_URL + "/" + movement);
}

function parseMovementToURL() {
	// commandStack[commandStack.length - 1] ====> parse
	return "...";
}

function displayToUser(message) {
	announcer.innerHTML = message;
	announcer.style.setProperty('opacity', 1);
	setTimeout(function() {
		announcer.style.setProperty('opacity', 0)
	}, 1000);
}
