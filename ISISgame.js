// main game engine
// author: hoylemd

// ISIS main engine builder
var ISIS_engine = function()
{
	// graphics objects
	var objCanvas = document.getElementById("myCanvas");
	var objContext = objCanvas.getContext("2d");

	// I/O object
	var io = ISIS_IO();

	// unit objects	
	var unit = ISIS_unit(objContext);
	var player = null;
	var enemy = null;

	// orders objects
	var orders = ISIS_order();

	// Bar data
	var buttonWidth = 150;
	var barHeight = 50;

	// Orders data
	var moveOrder = false;
	var attackOrder = false;
	var moveTarget = null;

	// Map data
	var tilesX;
	var tilesY;
	var mapWidth;
	var mapHeight;
	var clientWidth;
	var clientHeight;

	// image manifest
	var objImageManifest = {
		"spaceTile" : {id: "spaceTile", path : "space.png", loaded: false},
		"immortal1" : {id: "immortal1", path : "Immortal1.png", loaded: false},
		"immortal2" : {id: "immortal2", path : "Immortal2.png", loaded: false},
		"ArkadianCruiser" : {id: "ArkadianCruiser", path: "ark-cru.png",
			loaded: false},
		"MoveButton" : {id: "MoveButton", path: "MoveButton.png",
			loaded: false},
		"MoveButtonPressed" : {id: "MoveButtonPressed", 
			path: "MoveButtonPressed.png", loaded: false},
		"GoButton" : {id: "GoButton", path: "GoButton.png", loaded: false},
		"AttackButton" : {id: "AttackButton", path: "AttackButton.png", 
			loaded: false},
		"AttackButtonPressed" : {id: "AttackButtonPressed", 
			path: "AttackButtonPressed.png", loaded: false}
	};

	// function to update the manifest of loaded images
	// id: the id of the image that's finsihed loading
	var funImageLoaded = function(id)
	{
		// assume done until proven otherwise
		var blnDone = true;

		// set the specified image loaded flag to true
		objImageManifest[id].loaded = true;

		// look over the manifest looking for unleaded images
		for (var ent in objImageManifest)
		{
			// set done flag to done if some are unloaded
			if (objImageManifest[ent].loaded == false)
			{
				blnDone = false;
				break;
			}
		}	

		// if done, initialize game.
		if (blnDone) 
		{
			player = unit(images["ArkadianCruiser"]);
			enemy = unit(images["immortal2"]);
			enemy.moveTo(700, 400);
			enemy.rotation = 0;
			funUpdate();
		}
	}

	// Load up all neccesary content
	var images = function(){
		var theImages = {}

		// Load the images in the manifest
		for ( i in objImageManifest )
		{
			theImages[i] = io.loadImage(objImageManifest[i], funImageLoaded);
		}

		return theImages;
	}();

	// augment the context with a reset function
	objContext.reset = function()
	{	
		this.setTransform(1, 0, 0, 1, 0, 0);	
	};

	// Function to redraw the background
	var funDrawBackground = function ()
	{
		
		// clear the screen
		objContext.clearRect(0, 0, objCanvas.width, objCanvas.height);
		objContext.fillStyle = "#990099";
		objContext.fillRect(0, 0, objCanvas.width, objCanvas.height);

		// set the context to the tile offset
		objContext.translate(50, 50)
	
		// draw rows
		for (var i = 0; i < tilesY; i++)
		{
			// draw each tile
			for(var j = 0; j < tilesX; j++)
			{
				objContext.drawImage(images["spaceTile"], -50,
					-50);
				objContext.translate(100, 0);
			}
		
			objContext.translate(-mapWidth, 100);
		}

		// reset the context
		objContext.reset();
	};

	// function to draw the grid lines
	var drawGrid = function()
	{
		// set up for grid drawing
		objContext.reset();	
		objContext.beginPath();
		objContext.lineWidth = 1;
		objContext.strokeStyle = "#440044";

		// set initial pixel offset (makes lines draw sharp)
		var currX = -0.5;
		var currY = -0.5;

		// draw vertical lines
		for(var i = 1; i < tilesX; i++)
		{
			currX += 100;
			objContext.moveTo(currX, currY);
			objContext.lineTo(currX, currY + mapHeight + 1);
		}

		// reset initial pixel offset
		var currX = -0.5;
		var currY = -0.5;

		// draw horizontal lines
		for(var i = 1; i < tilesY; i++)
		{
			currY += 100;
			objContext.moveTo(currX, currY);
			objContext.lineTo(currX + mapWidth + 1, currY);
		}

		// draw the lines
		objContext.stroke();
		objContext.reset();
	};

	// function to draw the bottom orders bar
	var drawBar = function()
	{
		// set up
		objContext.reset();
		objContext.fillStyle = "#999999";

		// calculate position
		var barTop = clientHeight - barHeight;
		
		// draw the bar background
		objContext.fillRect(0, barTop, clientWidth, barHeight);
		
		// prepare to draw buttons
		objContext.reset();
		objContext.translate(0, barTop);
		var buttonImage;

		// draw the Move button
		if (moveOrder)
			buttonImage = images["MoveButtonPressed"];
		else
			buttonImage = images["MoveButton"];
		objContext.drawImage(buttonImage, 0, 0);

		// draw the Attack button
		if (attackOrder)
			buttonImage = images["AttackButtonPressed"];
		else
			buttonImage = images["AttackButton"];
		objContext.drawImage(buttonImage, buttonWidth, 0);

		// draw the Go button
		objContext.translate(clientWidth - buttonWidth, 0);
		objContext.drawImage(images["GoButton"], 0, 0);
	};

	// function to update the screen
	var funUpdate = function()
	{
		// reset the window size
		clientWidth = 1000;
		clientHeight = 750;

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

		// draw  backdrop
		funDrawBackground();
		drawGrid();

		// draw sprites
		player.draw();
		enemy.draw();

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
				if (moveOrder)
				{
					// register a move order if the move order is active
					player.registerOrder(orders.move(mousePos.x, mousePos.y));
					moveOrder = false;	
				}
				if (attackOrder)
				{
					// register an attack order is the attack order is active
					player.registerOrder(orders.attack(player, enemy);
					console.log("attack on " + mousePos.x + ", " + mousePos.y);
					attackOrder = false;
				}
			}
			if (mousePos.y > (clientHeight - barHeight))
			{	
				// click on a button
				if (mousePos.x < buttonWidth)
				{
					// Move button		
					moveOrder = !moveOrder;
				}
				else if (mousePos.x < 2 * buttonWidth)
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
			funUpdate();
		}
	);	

	// Expose objects
	return {
		context : objContext,
		images : images,
		drawBackground : funDrawBackground,
	};	

};
