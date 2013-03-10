// Main driver file

// class libary variable
var ISIS = {};

window.onload = function () {
	var canvas = document.getElementById("myCanvas");
	var io = new ISIS_IO();

	// set up the main engine
	ISIS.Engine = ISIS_Engine(canvas, io);

}
