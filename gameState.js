//victory state object

var ISIS_gameState = function (game, canvas, content) {
	var game_state_prototype = {
		addComponent : function (component) {
			this.components.push(component);
			if (component.draw) {
				this.drawable_components.push(component);
			}
		},

		initialize : function () {
			this.initialized = true;
		},

		update : function (elapsed) {
			var i = 0;
			for (i in this.components) {
				this.components[i].update(elapsed);
			}
			for (i in this.drawable_components) {
				this.drawable_components[i].update(elapsed);
			}
		}
	};

	return function () {
		var sprite_manager = ISIS_sprite_manager(canvas)()
		var new_state = {
			__proto__ : game_state_prototype,

			// component list
			components : [],
			drawable_components : [],

			// graphics objects
			context : canvas.getContext("2d"),
			spriteManager : sprite_manager,

			// content assets
			images : content.images,

			// I/O object
			io : ISIS_IO(),

			// state
			initialized : false
		}

		new_state.addComponent(sprite_manager);

		return new_state;

	};
}
