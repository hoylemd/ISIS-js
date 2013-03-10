// Main driver file

// class libary variable
var ISIS = {};

window.onload = function () {
	var canvas = document.getElementById("myCanvas");
	var io = new ISIS_IO();

	// initialize class library
	ISIS.Manager = ISIS_Manager();
	ISIS.SpriteManager = ISIS_SpriteManager(canvas);
	ISIS.ParticleManager = ISIS_ParticleManager();
	ISIS.ProjectileManager = ISIS_ProjectileManager();
	ISIS.FleetView = ISIS_fleetView(canvas);
	ISIS.GameState = ISIS_gameState();

	// set up the main engine
	ISIS.Engine = ISIS_Engine(canvas, io);

}
