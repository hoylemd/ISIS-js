// Orders object file

// Builder function for orders factory object
var ISIS_order = function()
{

	// Order class prototype (hidden)
	var order_prototype =
	{	
		// generic members
		name : "Unnamed Order", 
		colour : "#EEEEEE"
	}

	// construct object
	return {

		// builder function for Move order
		move: function(toX, toY)
		{
			// build the prototyoe
			var new_order =  {
				__proto__ : order_prototype
			};
			
			// add the name
			new_order.name = "move";
			new_order.colour = "00CC00";

			// add the destination
			if (toX && toY)
			{
				new_order.x = toX;
				new_order.y = toY;
			}
			else
			{
				// log error
				console.log("Move Order created without destination.");
			}

			// return the new order
			return new_order;
		},

		// builder function for Attack order
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
				new_order.target = target;
			else
				console.log("Attack order created without target.");

			return new_order;
		}
	}
}
