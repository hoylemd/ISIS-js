// Clickable class
function ISIS_Clickable () {
	var clickable_proto = {
		check : function (point) {
			if (point.x >= this.position.x &&
				point.x <= this.position.x + this.dimensions.x &&
				point.y >= this.position.y &&
				point.y <= this.position.y + this.dimensions.y)
			{
				this.handler();
			}
		}
	}

	return function (params) {
		this.__proto__ = clickable_proto;

		// check the params
		if (params["position"] &&
			params["dimensions"] &&
			params["handler"])
		{
			this.position = params["position"];
			this.dimensions = params["dimensions"];
			this.handler = params["handler"];
		} else {
			throw new "Invalid clickable parameters";
		}
	}
}
