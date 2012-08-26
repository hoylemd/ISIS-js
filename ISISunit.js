
var ISIS_unit = function(context)
{
	var tileSize = 100;
	var offset = 0;

	// Unit class prototype function (hidden)
	var unit_prototype =
	{
		x : 0,	// y coord
		y : 0,	// x coord
		name : "Unnamed Unit",	// unit name 

		// movement function
		moveTo : function(intX, intY){

			//alert(intX + ", " + intY + ", " + tileSize); 			
			var xOffset = intX % tileSize;
			var yOffset = intY % tileSize;

			//alert(xOffset + ", " + yOffset);

			//alert((intX - xOffset) + ", " + (intY - yOffset));

			this.x = intX - xOffset;
			this.y = intY - yOffset;
		},

		// drawing function
		draw: function()
		{
			// reset the context
			context.reset();

			// draw the sprite image if it exists
			if (this.image)
			{
				context.translate(this.x + offset, this.y + offset);
				context.drawImage(this.image, 0, 0);
				context.reset();
			}
		}
	}

	// builder function for unit
	return function(image)
	{
		// build thae prototyoe
		var new_unit =  {
			__proto__ : unit_prototype
		};

		// add the sprite image if it exists
		if (image)
		{
			new_unit.image = image;
			offset = tileSize - image.width;
		}

		// return the new unit
		return new_unit;
	}
}
