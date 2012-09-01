
// ISIS main engine class
var ISIS_engine = function()
{
	/* graphics objects */
	var objCanvas = document.getElementById("myCanvas");
	var objContext = objCanvas.getContext("2d");

	// I/O object
	var io = ISIS_IO();

	// unit objects	
	var unit = ISIS_unit(objContext);
	var player = null;
	var enemy = null;

	// Bar data
	var barHeight = 50;

	// Map data
	var tilesX;
	var tilesY;
	var mapWidth;
	var mapHeight;
	var clientWidth;
	var clientHeight;

	/* image manifest */
	var objImageManifest = {
		"spaceTile" : {id: "spaceTile", path : "space.png", 
			loaded: false},
		"immortal1" : {id: "immortal1", path : "Immortal1.png", 
			loaded: false},
		"immortal2" : {id: "immortal2", path : "Immortal2.png",
			loaded: false},
		"ArkadianCruiser" : {id: "ArkadianCruiser", path: "ark-cru.png",
			loaded: false}
	};

	/* function to update the manifest of looaded images */
	var funImageLoaded = function(id)
	{
		var blnDone = true;
		objImageManifest[id].loaded = true;
		for (var ent in objImageManifest)
		{
			//alert("inloop " + objImageManifest[ent].loaded)
			if (objImageManifest[ent].loaded == false)
			{
				blnDone = false;
				break;
			}
		}	

		if (blnDone) 
		{
			player = unit(images["ArkadianCruiser"]);
			enemy = unit(images["immortal2"]);
			enemy.moveTo(700, 400);
			enemy.rotation = 0;
			funUpdate();
		}
	}

	/* Load up all neccesary content */
	var images = function(){
		return {
			spaceTile : io.loadImage(objImageManifest["spaceTile"],
								funImageLoaded),
			immortal1 : io.loadImage(objImageManifest["immortal1"],
								funImageLoaded),
			immortal2 : io.loadImage(objImageManifest["immortal2"],
								funImageLoaded),
			ArkadianCruiser : io.loadImage(objImageManifest["ArkadianCruiser"],
								funImageLoaded)
		}
	}();

	/* Function to reset the canvas context */
	objContext.reset = function()
	{	
		this.setTransform(1, 0, 0, 1, 0, 0);	
	};

	/* Function to redraw the background */
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

	var drawGrid = function()
	{
		// set up for grid drawing
		objContext.reset();	
		objContext.lineWidth = 1;
		objContext.strokeStyle = "#440044";
		objContext.beginPath;
		var currX = -0.5;
		var currY = -0.5;

		// draw vertical lines
		for(var i = 1; i < tilesX; i++)
		{
			currX += 100;
			objContext.moveTo(currX, currY);
			objContext.lineTo(currX, currY + mapHeight + 1);
		}

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

	var drawBar = function()
	{
		objContext.reset();
		objContext.fillStyle = "#999999";
		objContext.fillRect(0, clientHeight - barHeight, clientWidth, barHeight);
	};

	var funUpdate = function()
	{
		clientWidth = document.body.clientWidth - 20;
		clientHeight = document.body.clientHeight - 20;

		objCanvas.width = clientWidth;
		objCanvas.height = clientHeight;
			
		// Prepare for next round of drawing			
		objContext.clearRect(0, 0, 1500, 1500);
		objContext.reset();

		tilesX = Math.floor(clientWidth / 100);
		tilesY = Math.floor((clientHeight - barHeight) / 100);
		mapWidth = tilesX * 100;
		mapHeight = tilesY * 100;
		
		funDrawBackground();

		drawGrid();

		player.draw();
		enemy.draw();

		drawBar();
	};

	//Add an event listener for mouse clicks
	objCanvas.addEventListener('click', 
		function(evt)
		{
			// get the mouse position
			var mousePos = io.getMousePos(objCanvas, evt);
		
			if (mousePos.x < mapWidth && mousePos.y < mapHeight)
				player.moveTo(mousePos.x, mousePos.y);	
		
			funUpdate();
		}
	);	

	return {
		context : objContext,
		images : images,
		drawBackground : funDrawBackground,
	};	

};
