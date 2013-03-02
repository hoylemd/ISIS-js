// game state object
var ISIS_gameState = function (game, canvas, content) {
	// prototype
	var game_state_prototype = {
		// function to add a component
		addComponent : function (component) {
			this.components.push(component);
			if (component.draw) {
				this.drawable_components.push(component);
			}
		},

		// initializer
		initialize : function () {
			this.initialized = true;
		},

		// updater
		update : function (elapsed) {
			var i = 0;

			// update all the child components
			for (i in this.components) {
				this.components[i].update(elapsed);
			}

			// draw all the drawable components
			for (i in this.drawable_components) {
				this.drawable_components[i].draw();
			}
		}
	};

	// return the constructor
	return function () {
		this.__proto__ = game_state_prototype;

		// component list
		this.components = [];
		this.drawable_components = [];

		// graphics objects
		this.context = canvas.getContext("2d");
		this.sprite_manager = new ISIS_sprite_manager(canvas)();

		// content assets
		this.images = content.images;

		// I/O object
		this.io = new ISIS_IO();

		// state
		this.initialized = false;

		this.addComponent(sprite_manager);
	};
}
