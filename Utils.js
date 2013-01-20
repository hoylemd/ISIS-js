// Utilities file
// author: hoylemd

var ISIS_IO = function()
{
	// Add the Tau constant to Math
	Math.TAU = 2 * Math.PI;

	// add the dx function to Math
	Math.dx = function(x)
	{
		var res = Math.floor(Math.random() * x);
		return res;
	}

	// Add the d100 function to Math
	Math.d100 = function()
	{
		return Math.dx(100);
	}

	// Add the calcVector function to Math
	Math.calcVector = function(p1, p2) {
		var x = p2.x - p1.x;
		var y = p2.y - p1.y;
		var theta = Math.atan(x / y);
		var vector = {x: 0, y: 0};
		if (x != 0) {
			vector.x = Math.abs(Math.sin(theta));
		}
		if (y != 0) {
			vector.y = Math.abs(Math.cos(theta));
		}

		if (p1.x > p2.x){
			vector.x *= -1;
		}

		if (p1.y > p2.y) {
			vector.y *= -1;
		}

		return vector;

	};

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
Math.calculateLineAngle = function(p1, p2)
{

	// calculate deltas
	var dx = p2.x - p1.x;
	var dy = p2.y - p1.y;

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
};

// http://paulirish.com/2011/requestanimationframe-for-smart-animating/
// http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating

// requestAnimationFrame polyfill by Erik Möller
// fixes from Paul Irish and Tino Zijdel

(function() {
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame']
                                   || window[vendors[x]+'CancelRequestAnimationFrame'];
    }

    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() { callback(currTime + timeToCall); },
              timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };

    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
}());
