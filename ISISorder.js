Math.TAU = 2 * Math.PI

var ISIS_order = function()
{

	// Order class prototype (hidden)
	var order_prototype =
	{	
		name : "Unnamed Order",	// order name 
	}

	return {

		// builder function for Move order
		move: function(toX, toY)
		{
			// build the prototyoe
			var new_order =  {
				__proto__ : order_prototype
			};
			
			// add the destination
			if (toX && toY)
			{
				new_order.destX = toX;
				new_order.destY = toY;
			}
			else
			{
				console.log("Move Order created without destination.");
			}

			// return the new unit
			return new_order;
		}
	}
}
