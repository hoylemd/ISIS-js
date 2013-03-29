// ISIS main engine
var ISIS_Engine = function (canvas, io) {
	// state pointer
	var current_state = null;

	// content assets
	var content = {
		images : {},

		// function to load an image from a content manifest entry
		loadImage : function (manifest_entry) {
			var image = new Image();
			var that = this;
			image.onload = function () {
				that.images[manifest_entry.id] = this;
				that.imageLoaded(manifest_entry.id);
			};
			image.src = manifest_entry.path;
		},

		imageLoaded : function (id){
			// assume done until proven otherwise
			var blnDone = true;

			// set the specified image loaded flag to true
			this.manifest[id].loaded = true;

			// look over the manifest looking for unleaded images
			for (var ent in this.manifest) {
				// set done flag to done if some are unloaded
				if (this.manifest[ent].loaded == false)
				{
					blnDone = false;
					break;
				}
			}

			// if done, invoke callback.
			if (blnDone) {
				this.doneCallback();
			}

		},

		load : function (callback) {
			this.doneCallback = callback

			for (var i in this.manifest) {
				this.images[i] = this.loadImage(this.manifest[i]);
			}
		}
	};


	// image manifest
	content.manifest = {
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

	// timing data
	var lastTime;

	// function to initialize the game
	this.initialize = function () {
		// initialize class library
		ISIS.Manager = ISIS_Manager();
		ISIS.SpriteManager = ISIS_SpriteManager(canvas);
		ISIS.ParticleManager = ISIS_ParticleManager();
		ISIS.ProjectileManager = ISIS_ProjectileManager();
		ISIS.FleetView = ISIS_fleetView(canvas);
		ISIS.UnitManager = ISIS_UnitManager(canvas, content);
		ISIS.GameState = ISIS_gameState(this, io, canvas, content);
		ISIS.BattleState = ISIS_battleState();

		current_state = new ISIS.BattleState();
		current_state.initialize();

		var that = this;
		var mainLoop = function() {
			that.update();
			animFrame(mainLoop);
		};

		animFrame(mainLoop);
	};

	// function to update the screen
	this.update = function () {
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
	};

	// function to transition to a new state
	this.changeState = function (new_state) {
		var old_state = current_state;
		current_state = new_state;
		new_state.initialize();
		old_state.dispose();
		delete old_state;
	};

	// package the initialize function
	var initializer = function (that) {
		return function() {
			that.initialize();
		};
	}(this);

	// load content
	content.load(initializer);

	// augment the context with a reset function
	canvas.getContext("2d").reset = function () {
		this.setTransform(1, 0, 0, 1, 0, 0);
		this.globalAlpha = 1;
	};

	canvas.boundSprite = function (sprite) {
		return sprite.position.x < this.width &&
		sprite.position.x > 0 &&
		sprite.position.y < this.height &&
		sprite.position.y > 0;
	};
};
