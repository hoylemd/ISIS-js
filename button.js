var ISIS_Button = function (sprite_manager, clickable_manager) {
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
			this.sprite = new sprite_manager.ButtonSprite(params);

			// wrap the handler
			params['handler'] = buttonAnimation(params['handler']);

			this.clickable = new clickable_manager.Clickable(params);

		} else {
			throw new "Invalid Button Parameters";
		}
	}
	return Button;

};
