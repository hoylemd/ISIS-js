// code file for button managers
var ISIS_ButtonManager = function () {
	var buttonAnimation = function (that, handler) {
		return function (params) {
			if (that.toggle) {
				that.active = !that.active;
				that.sprite.active = that.active;
			} else {
				that.sprite.animate(100);
			}
			handler(params);
		};
	};

	var button_prototype = {

	};

	var buttonConstructor = function (manager) {
		return function (params) {
			this.__proto__ = button_prototype;
			if (params['dimensions'] &&
				params['active_colour'] &&
				params['inactive_colour'] &&
				params['text'] &&
				params['font'] &&
				params['font_active_colour'] &&
				params['font_inactive_colour'] &&
				params['handler']){

				// build the sprite
				this.sprite = new manager.sprite_manager.ButtonSprite(params);

				// save the type
				this.toggle = params['toggle'];
				this.active = false;

				// wrap the handler
				params['handler'] = buttonAnimation(this, params['handler']);

				// make it clickable
				this.clickable =
					new manager.clickable_manager.Clickable(params);

			} else {
				throw new "Invalid Button Parameters";
			}
		};
	};

	var ButtonManager = function (params) {
		this.__proto__ = new ISIS.Manager();

		// connect to relevant type managers
		this.sprite_manager = params["sprite_manager"];
		this.clickable_manager = params["clickable_manager"];

		// install the Button Constructor
		this.Button = buttonConstructor(this);
	}

	return ButtonManager;

};
