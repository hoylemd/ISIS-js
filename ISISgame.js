
// ISIS main engine class
var ISIS_engine = function()
{
	/* graphics objects */
	var objCanvas = document.getElementById("myCanvas");
	var objContext = objCanvas.getContext("2d");

	// I/O object
	var io = ISIS_IO();

	// player object	
	var unit = ISIS_unit(objContext);
	
	var player = null;

	/* image manifest */
	var objImageManifest = {
		"spaceTile" : {id: "spaceTile", path : "space.png", 
			loaded: false},
		"immortal1" : {id: "immortal1", path : "Immortal1.png", 
			loaded: false},
		"immortal2" : {id: "immortal2", path : "Immortal2.png",
			loaded: false},
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
			player = unit(images["immortal1"]);
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
		// set the context to the tile offset
		objContext.translate(50, 50)
	
		// draw rows
		for (var i = 0; i < 15; i++)
		{
			// draw each tile
			for(var j = 0; j < 15; j++)
			{
				objContext.drawImage(images["spaceTile"], -50,
					-50);
				objContext.translate(100, 0);
			}
		
			objContext.translate(-1500, 100);
		}

		// reset the context
		objContext.reset();
	};

	var funUpdate = function()
	{
		// Prepare for next round of drawing			
		objContext.clearRect(0, 0, 1500, 1500);
		objContext.reset();

		funDrawBackground();

		player.draw();
	}

	//Add an event listener for mouse clicks
	objCanvas.addEventListener('click', 
		function(evt)
		{
			// get the mouse position
			var mousePos = io.getMousePos(objCanvas, evt);
			
			player.moveTo(mousePos.x, mousePos.y);	
		
			funUpdate();
		}
	);	

	return {
		context : objContext,
		images : images,
		drawBackground : funDrawBackground,
	}	

};
