// Main driver file

// class libary variable
var ISIS = {};

window.onload = function () {
	var canvas = $("#canvas")[0];
	var wrapper = $("#canvasWrapper")[0];

	// set up the main engine
	ISIS.IO = new ISIS_IO(canvas);
	ISIS.Engine = ISIS_Engine(canvas, wrapper);
}
