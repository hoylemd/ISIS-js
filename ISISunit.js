Math.TAU = 2 * Math.PI;

var ISIS_unit = function(context)
{
	var tileSize = 100;
	var offset = 0;
	var rotation = 0;

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

			var newX = intX - xOffset;
			var newY = intY - yOffset;
			
			// calculate rotation
			var dx = newX - this.x;
			var dy = newY - this.y;

			alert(dx + ", " + dy);
			// determine quadrant
			if (dy < 0)
			{
				if (dx == 0)
				{
					rotation = 0;
				}
				else
				{
					rotation = -1 * Math.atan(dx / dy);
				}
			}
			else if (dy == 0)
			{
				if (dx > 0)
				{
					rotation = Math.TAU * 0.25;
				}
				else if (dx < 0)
				{
					rotation = Math.TAU * -0.25;
				}
			}
			else
			{
				if (dx == 0)
				{
					rotation = Math.TAU * 0.5;
				}
				else
				{
					rotation =  Math.TAU * 0.5 - Math.atan(dx / dy) ;
				}
			}

			this.x = newX;
			this.y = newY;
		},

		// drawing function
		draw: function()
		{
			// reset the context
			context.reset();

			// draw the sprite image if it exists
			if (this.image)
			{
				context.translate(this.x + 0.5 * tileSize,
					   	this.y + 0.5 * tileSize);
				context.rotate(rotation);
				context.translate();
				context.drawImage(this.image, -1 * (0.5 * tileSize - offset), 
					-1 * (0.5 * tileSize - offset));
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
			offset = (tileSize - image.width) / 2;
		}

		// return the new unit
		return new_unit;
	}
}
