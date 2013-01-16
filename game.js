// main game engine
// author: hoylemd

// ISIS main engine builder
var ISIS_engine = function()
{
	// graphics objects
	var objCanvas = document.getElementById("myCanvas");
	var objContext = objCanvas.getContext("2d");

	// content assets
	var images = {};

	// fleet view objects
	var fleetView = ISIS_fleetView(objContext);
	var playerFleetView;

	// sprite objects
	var Sprite = ISIS_sprite(objContext);
	var SpriteManager = ISIS_spriteManager(Sprite);
	var spriteManager = SpriteManager(objCanvas);

	// I/O object
	var io = ISIS_IO();

	// weapon objects
	var Weapon = ISIS_weapon(spriteManager);

	// unit objects
	var unit = ISIS_unit(objContext, images, spriteManager);
	var player = null;
	var enemy = null;

	// orders objects
	var orders = ISIS_order();

	// Bar data
	var buttonWidth = 150;
	var barHeight = 50;

	// Orders data
	var attackOrder = false;

	// Map data
	var tilesX;
	var tilesY;
	var mapWidth;
	var mapHeight;
	var clientWidth;
	var clientHeight;

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
		"bullet" : {id: "bullet", path: "bullet.png", loaded: false}
	};

	// function to initialize the game
	var funInitGame = function(){
		player = unit("ArkadianCruiser", {x:1, y:1}, 0);
		player.name = "Arkadian Cruiser";
		player.setHull(100);
		player.addWeapon(Weapon("Arkadian Railgun", 10, 25, 15, images["bullet"], 25));

		enemy = unit("TerranCruiser", {x:1, y:1}, 0);
		enemy.name = "Terran Cruiser";
		enemy.setHull(150);
		enemy.addWeapon(Weapon("Terran Mass Driver", 25, 10, 30, images["bullet"], 20));

		playerFleetView = fleetView(images["spaceTile"], SpriteManager());
		playerFleetView.move(0, 0);
		playerFleetView.facing = 1/4 * Math.TAU;
		playerFleetView.resize(500, 600);
		playerFleetView.addShip(player);

		enemyFleetView = fleetView(images["spaceTile"], SpriteManager());
		enemyFleetView.move(600, 0);
		enemyFleetView.facing = 3/4 * Math.TAU;
		enemyFleetView.resize(500, 600);
		enemyFleetView.addShip(enemy);
		enemy.moveTo(850, 350);

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
	objContext.reset = function()
	{
		this.setTransform(1, 0, 0, 1, 0, 0);
	};

	// function to draw the bottom orders bar
	var drawBar = function()
	{
		// set up
		objContext.reset();
		objContext.fillStyle = "#777777";

		// calculate position
		var barTop = clientHeight - barHeight;

		// draw the bar background
		objContext.fillRect(0, barTop, clientWidth, barHeight);

		// prepare to draw buttons
		objContext.reset();
		objContext.translate(0, barTop);
		var buttonImage;

		// draw the Attack button
		if (attackOrder)
			buttonImage = images["AttackButtonPressed"];
		else
			buttonImage = images["AttackButton"];
		objContext.drawImage(buttonImage, 0, 0);

		// draw the Go button
		objContext.translate(clientWidth - buttonWidth, 0);
		objContext.drawImage(images["GoButton"], 0, 0);
	};

	// function to update the screen
	var funUpdate = function()
	{
		var now = new Date();
		var elapsed = null;
		var elapsedMS = 0;

		if (lastTime != undefined) {
			elapsed = now.getTime() - lastTime.getTime();
		}
		lastTime = now;

		console.log("updating");
		// reset the window size
		clientWidth = $(window).width();
		clientHeight = $(window).height();

		// resize the canvas
		objCanvas.width = clientWidth;
		objCanvas.height = clientHeight;

		// recalculate map dimensions
		tilesX = Math.floor(clientWidth / 100);
		tilesY = Math.floor((clientHeight - barHeight) / 100);
		mapWidth = tilesX * 100;
		mapHeight = tilesY * 100;

		// Prepare for next round of drawing
		objContext.clearRect(0, 0, clientWidth, clientHeight);
		objContext.reset();

		// update units
		player.update(elapsed);
		enemy.update(elapsed);

		spriteManager.update(elapsed);

		// draw Fleet views
		playerFleetView.draw();
		enemyFleetView.draw();

		// draw other sprites
		spriteManager.draw();

		// draw order lines
		player.drawLines();
		enemy.drawLines();

		// draw the UI
		drawBar();
	};

	// Add an event listener for mouse clicks
	objCanvas.addEventListener('click',
		function(evt)
		{
			// get the mouse position
			var mousePos = io.getMousePos(objCanvas, evt);

			// clip to the section of the screen
			if (mousePos.x < mapWidth && mousePos.y < mapHeight)
	   		{
				if (attackOrder)
				{
					// register an attack order if the attack order is active
					if (enemy.collide(mousePos))
					{
						player.registerOrder(orders.attack(player, enemy));
					}
					else
						player.clearOrder("attack");
				}
				attackOrder = false;
			}
			if (mousePos.y > (clientHeight - barHeight))
			{
				// click on a button
				if (mousePos.x < buttonWidth)
				{
					attackOrder = !attackOrder;
				}
				else if (mousePos.x > clientWidth - buttonWidth)
				{
					// Go button
					player.carryOut();
				}
			}

			// Update the screen
			//funUpdate();
		}
	);



	// Expose objects
	return {
		context : objContext,
		images : images
	};

};
