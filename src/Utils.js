// Utilities file

// shim to make frame requests easy
var animFrame = window.requestAnimationFrame ||
	window.webkitRequestAnimationFrame ||
	window.mozRequestAnimationFrame ||
	window.oRequestAnimationFrame ||
	window.msRequestAnimationFrame ||
	null;

// Io object
var ISIS_IO = function (canvas) {
	var context = canvas.getContext("2D");
	var IO_prototype = {
		// function to get the position of the mouse pointer
		getMousePos : function (evt) {
			// get canvas position
			var context_top = 0;
			var context_left = 0;
			while (context && context.tagName != 'BODY') {
				context_top += context.offsetTop
				context_left += context.offsetLeft;
				context = context.offsetParent;
			}

			// return relative mouse position
			return {
				x: evt.clientX - context_left + window.pageXOffset,
				y: evt.clientY - context_top + window.pageYOffset
			};
		},

	};

	return function () {
		this.__proto__ = IO_prototype;
		this.click = null;
		this.rightClick = null;
		this.keyDown = null;
		this.keyUp = null;
	};
};

// set Math's invertY flag
Math.invertY = false;

// Modify Math object
Math.TAU = 2 * Math.PI;

// dx function : generate random integer between 0 and x
Math.dx = function (x) {
	var res = Math.floor(Math.random() * x);
	return res;
};
Math.d100 = function () {
	return Math.dx(100);
};

// Vector math wooo
Math.toPrecision4 = function(theta) {
	return Math.round(theta * 10000) / 10000
}
Math.normalizeAngle = function(theta) {
	while (theta < 0) {
		theta += Math.TAU;
	}
	while (theta >= Math.TAU) {
		theta -= Math.TAU;
	}
	return theta;
};
Math.calcAngleVector = function (theta) {
	return {
		x: Math.sin(theta),
		y: Math.cos(theta) * (Math.invertY ? -1 : 1)
	};
};
Math.calcUnitVector = function (delta) {
	var theta = Math.atan2(delta.x, delta.y);
	return Math.calcAngleVector(theta);
};
Math.calcVector = function (p1, p2) {
	return Math.calcUnitVector({
		x: p2.x - p1.x,
		y: p2.y - p1.y
	});
};
Math.calcVectorAngle = function (vector) {
	return Math.atan2(vector.x, -1 * vector.y);
};
Math.multVector = function (vector, magnitude) {
	return {x: vector.x * magnitude,
		y: vector.y * magnitude};
};
Math.addVectors = function (v1, v2) {
	return {
		x: v1.x + v2.x,
		y: v1.y + v2.y
	}
};
Math.composeVector = function (angle, magnitude) {
	var unit = Math.calcAngleVector(angle);
	return Math.multVector(unit, magnitude);
};
Math.vectorMagnitude = function (vector) {
	return Math.sqrt(vector.x * vector.x + vector.y*vector.y);
};
Math.vectorMetrics = function (vector) {
	var angle = Math.atan2(vector.x, vector.y);
	var unitVector = Math.calcAngleVector(angle);
	var magnitude = Math.vectorMagnitude(vector);
	return {
		"angle" : angle,
		"untiVector" : unitVector,
		"magnitude" : magnitude,
		"vector" : vector
	};
};

Math.rotateVector = function (vector, theta) {
	var theta_not = Math.calcVectorAngle(vector);
	var theta_prime = Math.normalizeAngle(theta_not + theta);
	return Math.composeVector(theta_prime, Math.vectorMagnitude(vector));
}


// Function to get the angle in radians between two points
Math.calculateLineAngle = function (p1, p2) {
	var dx = p2.x - p1.x;
	var dy = p2.y - p1.y;

	return Math.atan2(dx, dy);
};

// function to calculate the distance between 2 points in 2d
Math.calcDistancePoints = function (p1, p2) {
	var dx = p2.x - p1.x;
	var dy = p2.y - p1.y;

	// pythagorean theorem wooo
	return Math.sqrt(dx*dx + dy*+dy);
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
