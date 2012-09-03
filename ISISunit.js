Math.TAU = 2 * Math.PI;

var ISIS_unit = function(context)
{

	var tileSize = 100;

	// Unit class prototype (hidden)
	var unit_prototype =
	{
		x : 0,	// y coord
		y : 0,	// x coord
		name : "Unnamed Unit",	// unit name 
		
		offset : 0,
		rotation : 0,

		hp : 10,
		maxHp : 10,

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

			// determine quadrant
			if (dy < 0)
			{
				if (dx == 0)
				{
					this.rotation = 0;
				}
				else
				{
					this.rotation = -1 * Math.atan(dx / dy);
				}
			}
			else if (dy == 0)
			{
				if (dx > 0)
				{
					this.rotation = Math.TAU * 0.25;
				}
				else if (dx < 0)
				{
					this.rotation = Math.TAU * -0.25;
				}
			}
			else
			{
				if (dx == 0)
				{
					this.rotation = Math.TAU * 0.5;
				}
				else
				{
					this.rotation =  Math.TAU * 0.5 - Math.atan(dx / dy) ;
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
				context.rotate(this.rotation);
				context.translate();
				context.drawImage(this.image,
					-1 * (0.5 * tileSize - this.offset), 
					-1 * (0.5 * tileSize - this.offset));
				context.reset();
			}
		},

		// order registration
		registerOrder : function(order)
		{
			order.owner = this;
			this.order = order;
		},

		// carry out orders function
		carryOut : function()
		{
			if (this.order)
				this.moveTo(this.order.destX, this.order.destY);
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
			new_unit.offset = (tileSize - image.width) / 2;
		}

		// return the new unit
		return new_unit;
	}
}
