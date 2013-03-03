
// Main driver file
// author: hoylemd

// class libary variable
var ISIS = {};

window.onload = function () {
	var canvas = document.getElementById("myCanvas");
	var io = new ISIS_IO();

	// initialize class library
	ISIS.Engine = ISIS_Engine(canvas, io);

}
