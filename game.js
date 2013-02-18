// main game engine
// author: hoylemd

// ISIS main engine builder
var ISIS_engine = function () {
	var canvas = document.getElementById("myCanvas");
	var context = canvas.getContext("2d");

	var io = ISIS_IO();

	var current_state = {};

	// content assets
	var images = {};

	// image manifest
	var objImageManifest = {
		"spaceTile" : {id: "spaceTile", path : "space.png", loaded: false},
		"ArkadianCruiser" : {id: "ArkadianCruiser", path: "ark-cru.png",
			loaded: false},
		"TerranCruiser" : {id: "TerranCruiser", path: "ter-cru.png",
			loaded: false},
		"MoveButton" : {id: "MoveButton", path: "MoveButton.png",
			loaded: false},
		"MoveButtonPressed" : {id: "MoveButtonPressed",
			path: "MoveButtonPressed.png", loaded: false},
		"GoButton" : {id: "GoButton", path: "GoButton.png", loaded: false},
		"AttackButton" : {id: "AttackButton", path: "AttackButton.png",
			loaded: false},
		"AttackButtonPressed" : {id: "AttackButtonPressed",
			path: "AttackButtonPressed.png", loaded: false},
		"bullet" : {id: "bullet", path: "bullet.png", loaded: false},
		"debris1" : {id: "debris1", path: "debris1.png", loaded: false},
		"debris2" : {id: "debris2", path: "debris2.png", loaded: false},
		"debris3" : {id: "debris3", path: "debris3.png", loaded: false}
	};

	// function to initialize the game
	var funInitGame = function(){
		current_state = ISIS_battleState(canvas, {images : images});
		current_state.initialize();

		var mainLoop = function() {
			funUpdate();
			animFrame(mainLoop);
		};

		animFrame(mainLoop);
	};

	// function to update the manifest of loaded images
	// id: the id of the image that's finsihed loading
	var funImageLoaded = function(id){
		var newSprite = null;

		// assume done until proven otherwise
		var blnDone = true;

		// set the specified image loaded flag to true
		objImageManifest[id].loaded = true;

		// look over the manifest looking for unleaded images
		for (var ent in objImageManifest) {
			// set done flag to done if some are unloaded
			if (objImageManifest[ent].loaded == false)
			{
				blnDone = false;
				break;
			}
		}

		// if done, initialize game.
		if (blnDone) {
			funInitGame();
		}
	};

	// Load up all neccesary content
	for ( i in objImageManifest ) {
		images[i] = io.loadImage(objImageManifest[i], funImageLoaded);
	}

	// augment the context with a reset function
	context.reset = function () {
		this.setTransform(1, 0, 0, 1, 0, 0);
		this.globalAlpha = 1;
	};

	// function to update the screen
	var funUpdate = function () {
		current_state.update();
	};

	// Expose objects
	return {
		context : context,
		images : images
	};

};
