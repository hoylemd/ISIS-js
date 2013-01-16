// Orders object file

// Builder function for orders factory object
var ISIS_order = function()
{

	// Order class prototype (hidden)
	var order_prototype =
	{
	};

	// construct object
	return {
		attack: function(source, target)
		{
			// build the prototype
			var new_order = {
				__proto__ : order_prototype
			}

			// add the name
			new_order.name = "attack";
			new_order.colour = "#CC0000";

			// add the target and source
			if (source)
				new_order.source = source;
			else
				console.log("Attack order created without source.");
			if (target)
			{
				new_order.target = target;
				new_order.position = target.position;
			}
			else
				console.log("Attack order created without target.");

			// set it as pending
			new_order.pending = true;

			return new_order;
		};
	}
}
