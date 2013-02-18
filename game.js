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

	// timing data
	var lastTime;

	// Add animFrame jig
	var animFrame = window.requestAnimationFrame ||
		window.webkit.RequestAnimationFrame ||
		window.mozRequestAnimationFrame ||
		window.oRequestAnimationFrame ||
		window.msRequestAnimationFrame ||
		null ;

	// image manifest
	var image_manifest = {
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

	var engine = {
		// function to initialize the game
		initialize : function () {
			current_state = ISIS_battleState(this, canvas, {images : images});
			current_state.initialize();

			var that = this;
			var mainLoop = function() {
				that.update();
				animFrame(mainLoop);
			};

			animFrame(mainLoop);
		},

		// function to update the screen
		update : function () {
			var now = new Date();
			var elapsed = 0;

			if (lastTime != undefined) {
				elapsed = now.getTime() - lastTime.getTime();
			}
			lastTime = now;

			// reset the window size
			clientWidth = $(window).width();
			clientHeight = $(window).height();

			// resize the canvas
			canvas.width = clientWidth;
			canvas.height = clientHeight;

			current_state.update(elapsed);
		},

		changeState : function (new_state) {
			current_state = new_state;
		}
	};

	// function to update the manifest of loaded images
	// id: the id of the image that's finsihed loading
	var imageLoaded = function () {
		var that = engine;
		return function(id){
			var newSprite = null;

			// assume done until proven otherwise
			var blnDone = true;

			// set the specified image loaded flag to true
			image_manifest[id].loaded = true;

			// look over the manifest looking for unleaded images
			for (var ent in image_manifest) {
				// set done flag to done if some are unloaded
				if (image_manifest[ent].loaded == false)
				{
					blnDone = false;
					break;
				}
			}

			// if done, initialize game.
			if (blnDone) {
				that.initialize();
			}
		};
	}();

	// Load up all neccesary content
	for ( i in image_manifest ) {
		images[i] = io.loadImage(image_manifest[i], imageLoaded);
	}

	// augment the context with a reset function
	context.reset = function () {
		this.setTransform(1, 0, 0, 1, 0, 0);
		this.globalAlpha = 1;
	};

	return engine;
};
