/* Function to load an image from a path and return an image object
 * strPath: a String containing the relative path to the image
 * returns: an Image object mapped to the provided path */
function loadImage(entry, callback)
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
function getMousePos(objContext, evt){

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
