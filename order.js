// Orders object file

// Builder function for orders factory object
var ISIS_order = function(){
	// Order class prototype (hidden)
	var order_prototype = {
	};

	// construct object
	return {
		Attack: function(source, target) {
			// add the target and source
			if (source && target) {
				// build the prototype
				this.__proto__ = order_prototype;

				// add cosmetics
				this.name = "attack";
				this.colour = "#CC0000";

				// add affected parties
				this.source = source;
				this.target = target;
				this.position = target.position;

				// set it as pending
				this.pending = true;
			} else {
				console.log("Attack order created without or source.");
			}
		}
	};
};
