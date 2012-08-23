window.onload = function() 
{
	// create top-level object
	var ISIS = function()
	{
		/* graphics objects */
		var objCanvas = document.getElementById("myCanvas");
		var objContext = objCanvas.getContext("2d");
		
		/* Load up all neccesary content */
		var objImageLibrary = function(){
			return {
				spaceTile : loadImage("space.png"),
				immortal1 : loadImage("Immortal1.png"),
				immortal2 : loadImage("Immortal2.png")
			}
		}();

		/* Function to reset the canvas context */
		var funResetContext = function()
		{	
			objContext.setTransform(1, 0, 0, 1, 0, 0);	
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
					objContext.drawImage(objImageLibrary["spaceTile"], -50, -50);
					objContext.translate(100, 0);
				}
			
				objContext.translate(-1500, 100);
			}

			// reset the context
			funResetContext(objContext);
		};

		var funUpdate = function()
		{
			// Prepare for next round of drawing			
			objContext.clearRect(0, 0, 1500, 1500);
			cfnResetContext();

			funDrawBackground();
		}

		//Add an event listener for mouse clicks
		objCanvas.addEventListener('click', 
			function(evt)
			{
				// get the mouse position
				var mousePos = getMousePos(objCanvas, evt);
				
				// redraw the background
				funDrawBackground(objContext);
				
				funResetContext(objContext);
				
				objContext.translate(mousePos.x, mousePos.y);
			
				// draw the image
				objContext.drawImage(objImageLibrary["immortal1"], -40, -40);

				funResetContext(objContext);
			
			}
		);	

		return {
			context : objContext,
			images : objImageLibrary,
			resetContext : funResetContext,
			drawBackground : funDrawBackground
		}	
	}();

	ISIS.drawBackground();
};
