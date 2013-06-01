// game state object
var ISIS_gameState = function (game, canvas, content) {

	var last_z = 1000;

	// function to add a component
	var	addComponent = function (component, z) {
		this.components.push(component);
		if (component.draw) {
			z = z || last_z + 1;

			while (this.z_map[z]) {
				z += 1;
			}
			component.z = z;
			this.drawable_components.push(component);
			this.z_map[z] = component;
			last_z = z > last_z ? z : last_z;

			this.drawable_components.sort(function (a, b) {
					return a.z - b.z
				}
			);
		}
	};

	// initializer
	var initialize = function () {
		this.initialized = true;
	};

	// updater
	var update = function (elapsed) {
		var i = 0;

		// update all the child components
		for (i in this.components) {
			this.components[i].update(elapsed);
		}

		// draw all the drawable components
		for (i in this.drawable_components) {
			this.drawable_components[i].draw();
		}
	};

	// disposer
	var dispose = function () {
		var i = 0;

		for (i in this.components) {
			this.components[i].dispose();
			delete this.components[i];
		}
	};

	// prototype
	var game_state_prototype = {
		addComponent : addComponent,
		initialize : initialize,
		update : update,
		dispose : dispose
	};

	// return the constructor
	return function () {
		this.__proto__ = game_state_prototype;

		// game reference
		this.game = game;

		// component lists
		this.components = [];
		this.drawable_components = [];
		this.z_map = {};


		// graphics objects
		this.canvas = canvas;
		this.context = canvas.getContext("2d");
		this.sprite_manager = new ISIS.SpriteManager();

		// content assets
		this.content = content;

		// I/O object
		this.IO = new ISIS.IO();

		// state
		this.initialized = false;

		this.addComponent(this.sprite_manager, last_z);
	};
};
