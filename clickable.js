// Clickable class
function ISIS_ClickableManager () {
	var clickable_proto = {
		check : function (point) {
			if (point.x >= this.position.x &&
				point.x <= this.position.x + this.dimensions.x &&
				point.y >= this.position.y &&
				point.y <= this.position.y + this.dimensions.y)
			{
				this.handler();
				return true;
			}
			return false;
		},
		moveTo : function (destination) {
			this.position = {x: destination.x, y: destination.y};
		}
	}

	var clickableConstructor = function (manager) {
		return function (params) {
			this.__proto__ = clickable_proto;
			this.manager = manager;

			// check the params
			if (params["position"] &&
				params["dimensions"] &&
				params["handler"])
			{
				this.position = params["position"];
				this.dimensions = params["dimensions"];
				this.handler = params["handler"];

				if (!params["do_not_register"]) {
					manager.add(this);
				}

			} else {
				throw new "Invalid clickable parameters";
			}
		}
	};

	var clickableManagerUpdate = function (elapsed) {

	};

	var check = function (point) {
		var handled = false;
		for (var i in this.object_list) {
			handled = handled || this.object_list[i].check(point);
		}
		return handled;
	};

	return function () {
		this.__proto__ = new ISIS.Manager();
		this.type_proto = clickable_proto;

		// set up the constructor
		this.Clickable = clickableConstructor(this);

		// update method
		this.update = clickableManagerUpdate

		// click checker
		this.check = check;
	}
}
