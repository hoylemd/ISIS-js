// Utilities file
// author: hoylemd

var ISIS_IO = function()
{
	// Add the Tau constant to Math
	Math.TAU = 2 * Math.PI;

	/* Function to load an image from a path and return an image object
	 * strPath: a String containing the relative path to the image
	 * returns: an Image object mapped to the provided path */
	var funLoadImage = function(entry, callback)
	{
		// construct and initialize the object
		var objImage = new Image();
		var blnDoneLoading = false
		objImage.onload = function(){callback(entry.id);};
		objImage.src = entry.path;

		return objImage;
	}
	
	/* Function to get the mouse position
	 * objContext: a canvas context object to get the mouse position relative to
	 * evt: The mouse click event
	 * returns: an {x, y} object representing the mouse click's coordinates 
	 * 	relative to the top - left of the canvas.*/
	var funGetMousePos = function(objContext, evt)
	{
		// get canvas position
		var dblTop = 0;
		var dblLeft = 0;
		while (objContext && objContext.tagName != 'BODY') {
			dblTop += objContext.offsetTop;
			dblLeft += objContext.offsetLeft;
			objContext = objContext.offsetParent;
		}
		// return relative mouse position
		var dblX = evt.clientX - dblLeft + window.pageXOffset;
		var dblY = evt.clientY - dblTop + window.pageYOffset;
		return {
			x: dblX,
			y: dblY
		};
	}

	/* return the object */
	return {
		loadImage : funLoadImage,
		getMousePos : funGetMousePos
	}
}

// Modify Math object

// Function to get the angle in radians between two points
// x1: the x coordinate of the first point
// y1: the y coordinate of the first point
// x2: the x coordinate of the second point
// y2: the y coordinate of the second point
Math.calculateLineAngle = function(x1, y1, x2, y2)
{

	// calculate deltas
	var dx = x2 - x1;
	var dy = y2 - y1;

	// initialize rotation
	var rotation = 0;

	// calculate by quadrant
	if (dy < 0)
	{
		if (dx != 0)
			rotation = -1 * Math.atan(dx / dy);
	}
	else if (dy == 0)
	{
		if (dx > 0)
			rotation = Math.TAU * 0.25;
		else if (dx < 0)
			rotation = Math.TAU * -0.25;
	}
	else
	{
		if (dx == 0)
			rotation = Math.TAU * 0.5;
		else
			rotation =  Math.TAU * 0.5 - Math.atan(dx / dy);
	}

	return rotation;
}
