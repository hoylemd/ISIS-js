// code file for button managers
var ISIS_ButtonManager = function () {
	var buttonAnimation = function (that, handler) {
		return function (params) {
			if (that.toggle) {
				that.toggle();
			} else {
				that.sprite.animate(100);
			}
			handler(params);
		};
	};

	var toggle = function (value) {
		if (value || value === false) {
			this.active = value;
		} else {
			this.active = !this.active;
		}
	}

	var button_prototype = {
		update : function (elapsed) {
			if (this.toggle) {
				this.sprite.active = this.active;
			}
		},
		moveTo : function (destination) {
			this.sprite.moveTo(destination);
			this.clickable.moveTo(destination);
		},
		dispose : function () {
			if (this.manager) {
				this.manager.remove(this);
			}
		}
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

				// register the manager
				this.manager = manager

				// build the sprite
				this.sprite = new manager.sprite_manager.ButtonSprite(params);

				// save the type
				if (params['toggle']) {
					this.toggle = toggle;
					this.active = false;
				}
				// wrap the handler
				params['handler'] = buttonAnimation(this, params['handler']);

				// make it clickable
				this.clickable =
					new manager.clickable_manager.Clickable(params);

				// register to the manager
				if (!params['do_not_register']) {
					manager.add(this);
				}
			} else {
				throw "Invalid Button Parameters";
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
