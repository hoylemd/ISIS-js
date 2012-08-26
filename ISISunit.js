
var ISIS_unit = function(context)
{
	// Unit class prototype function (hidden)
	var unit_prototype =
	{
		x : 0,	// y coord
		y : 0,	// x coord
		name : "Unnamed Unit",	// unit name 

		// movement function
		moveTo : function(intX, intY){
			this.x = intX;
			this.y = intY;
		},

		// drawing function
		draw: function()
		{
			// reset the context
			context.reset();

			// draw the sprite image if it exists
			if (this.image)
			{
				context.translate(this.x, this.y);
				context.drawImage(this.image, 0, 0);
				context.reset();
			}
		}
	}

	// builder function for unit
	return function(image)
	{
		// build the prototyoe
		var new_unit =  {
			__proto__ : unit_prototype
		};

		// add the sprite image if it exists
		if (image)
		{
			new_unit.image = image;
		}

		// return the new unit
		return new_unit;
	}
}
