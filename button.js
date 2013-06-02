// code file for button managers
var ISIS_ButtonManager = function () {
	var buttonAnimation = function (handler) {
		return function (params) {
			console.log("button pressed");
			handler(params);
		};
	};

	var button_prototype = {

	};

	var Button = function (params) {
		this.__proto__ = button_prototype;
		if (params['dimensions'] &&
			params['active_colour'] &&
			params['inactive_colour'] &&
			params['text'] &&
			params['font'] &&
			params['font_active_colour'] &&
			params['font_inactive_colour'] &&
			params['handler']){
			this.sprite = new manager.sprite_manager.ButtonSprite(params);

			// wrap the handler
			params['handler'] = buttonAnimation(params['handler']);

			this.clickable = new manager.clickable_manager.Clickable(params);

		} else {
			throw new "Invalid Button Parameters";
		}
	};

	var ButtonManager = function (params) {
		this.__proto__ = new ISIS.Manager();

		// connect to relevant type managers
		this.sprite_manager = params["sprite_manager"];
		this.clickable_manager = params["clickable_manager"];

		// install the Button Constructor
		this.Button = Button;
	}

	return ButtonManager;

};
