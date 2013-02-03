// Utilities file
// author: hoylemd

var ISIS_IO = function()
{
	var IO_prototype = {
		// Function to load an image from a path and return an image object
		// strPath: a String containing the relative path to the image
		// returns: an Image object mapped to the provided path
		loadImage : function(entry, callback)
		{
			// construct and initialize the object
			var objImage = new Image();
			var blnDoneLoading = false
			objImage.onload = function(){callback(entry.id);};
			objImage.src = entry.path;

			return objImage;
		},

		// Function to get the mouse position
		// objContext: a canvas context object to get the mouse position
		//	relative to
		// evt: The mouse click event
		// returns: an {x, y} object representing the mouse
		//	click's coordinates relative to the top - left of the canvas.
		getMousePos : function(objContext, evt)
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
	};

	return {
		__proto__ : IO_prototype
	};
}

// Modify Math object

// Add the Tau constant to Math
Math.TAU = 2 * Math.PI;

// add the dx function to Math
Math.dx = function(x) {
	var res = Math.floor(Math.random() * x);
	return res;
}

// Add the d100 function to Math
Math.d100 = function() {
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

// Function to get the angle in radians between two points
Math.calculateLineAngle = function(p1, p2) {
	// calculate deltas
	var dx = p2.x - p1.x;
	var dy = p2.y - p1.y;

	return Math.atan2(dx, dy);
};

// Adapted from http://my.opera.com/emoller/blog/2011/12/20/reauestanimationframe-for-smart-er-animating
// incorporating fixes from Erik Moller, Paul Irish and Tino Zijdel

( function () {
	var lastTime = 0;
	var vendors = ['ms', 'moz', 'webkit', 'o'];
	var rafStr = 'RequestAnimationFrame';
	var cafStr = 'CancelAnimationFrame';
	var crafStr = 'CancelRequestAnimationFrame';

	for (var x = 0; x < vendors.length && !window.requestAnimationFrame;
		x++) {
		var prefix = vendors[x];
		window.requestAnimationFrame = window[prefix + rafStr];
		window.cancelAnimationFrame = window[prefix + cafStr] ||
			window[prefix + crafStr];
	}

	if (!window.requestAnimationFrame) {
		window.requestAnimationFrame = function (callback, element) {
			var currTime = new Date().getTime();
			var timeToCall = Math.max(0, 16 - (currTime - lastTime));
			var id = window.setTimeout(function () {
				callback(currTime + timeToCall);
			}, timeToCall);
			lastTime = currTime + timeToCall;
			return id;
		};
	}

	if (!window.cancelAnimationFrame) {
		window.cancelAnimationFrame = function (id) {
			clearTimeout(id);
		};
	}
}() );

// adapted from
// http://davidowens.wordpress.com/2010/09/07/html-5-canvas-and-dashed-lines/
CanvasRenderingContext2D.prototype.dashedLineTo = function (p1, p2, pattern) {
	var lt = function (a, b) {
			return a <= b;
		};
	var gt = function (a, b) {
			return a >= b;
		};

	var checkX = { thereYet: gt, cap: Math.min };
	var checkY = { thereYet: gt, cap: Math.min };

	if (p1.y - p2.y > 0) {
		checkY.thereYet = lt;
		checkY.cap = Math.max;
	}
	if (p1.x - p2.x > 0) {
		checkX.thereYet = lt;
		checkX.cap = Math.max;
	}

	this.moveTo(p1.x, p1.y);
	var offsetX = p1.x;
	var offsetY = p1.y;
	var i = 0;
	var dash = true;

	while (!(checkX.thereYet(offsetX, p2.x) &&
		checkY.thereYet(offsetY, p2.y))) {
		var theta = Math.atan(p2.y - p1.y, p2.x - p1.x);
		var len = pattern[i];

		offsetX = checkX.cap(p2.x, offsetX + (Math.cos(theta) * len));
		offsetY = checkY.cap(p2.y, offsetY + (Math.cos(theta) * len));

		if (dash) {
			this.lineTo(offsetX, offsetY);
		} else {
			this.moveTo(offsetX, offsetY);
		};

		i = (i + 1) % pattern.length;
		dash = !dash;
	}
};
