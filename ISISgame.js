window.onload = function() {
		// declare global variables
		var objCanvas;
		var objContext;
		var imgFloorTile;
		var imgWallTile;
		var imgCornerTile;
		var imgRedStar;
		var imgBlueStar;
	
		/* Function to load up all neccesary content */
		var loadContent = function(){
			imgSpaceTile = loadImage("space.png");
			imgFloorTile = loadImage("floor1.png");
			imgWallTile = loadImage("wall1.png");
			imgCornerTile = loadImage("corner1.png");
			imgRedStar = loadImage("redstar.png");
			imgBlueStar = loadImage("bluestar.png");
			imgImmortal1 = loadImage("Immortal1.png");
			imgImmortal2 = loadImage("Immortal2.png");
		}();
	
		// function to reset a context's transformation matrix
		function resetContext(objContext)
		{
			objContext.setTransform(1, 0, 0, 1, 0, 0);	
		}
	
		/* Function to draw the background tiles
		 * objContext: the context object to draw the tiles to. */
		function drawBackground(objContext)
		{

			// Prepare for next round of drawing			
			resetContext(objContext);
			objContext.clearRect(0, 0, objCanvas.width, objCanvas.height);
			
			objContext.translate(50, 50)
			// draw the middle rows
			for (var i = 0; i < 15; i++)
			{
				// draw the top row
				for(var j = 0; j < 15; j++)
				{
					objContext.drawImage(imgSpaceTile, -50, -50);
					objContext.translate(100, 0);
				}
			
				objContext.translate(-1500, 100);
			}

			objContext.translate(-1500, -1500);
		}	

		// get the canvas and context
		objCanvas = document.getElementById("myCanvas");
		objContext = objCanvas.getContext("2d");
		

		//Add an event listener for mouse clicks
		objCanvas.addEventListener('click', function(evt){

			// get the mouse position
			var mousePos = getMousePos(objCanvas, evt);
			
			// redraw the background
			drawBackground(objContext);
			
			resetContext(objContext);
			
			objContext.translate(mousePos.x, mousePos.y);
			
			// draw the image
			objContext.drawImage(imgImmortal1, -40, -40);
		})
	

		drawBackground(objContext);
		drawBackground(objContext);
	};
