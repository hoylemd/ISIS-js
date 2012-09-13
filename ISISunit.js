// Unit object source file
// author: hoylemd

// Main setup function
var ISIS_unit = function(context)
{
	// tile constant
	var tileSize = 100;

	// function to snap coordinates to the grid
	var snapToGrid = function(xIn, yIn)
	{
		// calculate offset
		var xOff = xIn % tileSize;
		var yOff = yIn % tileSize;

		// return new coords
		return {
			x: xIn - xOff,
			y: yIn - yOff
		};
	}

	// Unit class prototype (hidden)
	var unit_prototype =
	{
		// unit data
		x : 0,
		y : 0,
		name : "Unnamed Unit",
		
		// sprite drawing data
		offset : 0,
		rotation : 0,

		// combat data
		hp : 10,
		maxHp : 10,

		// movement function
		moveTo : function(intX, intY)
		{
			// calculate snapped coordinates
			var snapCoords = snapToGrid(intX, intY);

			// canculate new sprite position
			var newX = snapCoords.x;
			var newY = snapCoords.y;
			
			// calculate new rotation
			this.rotation = Math.calculateLineAngle(this.x, this.y,
				newX, newY);

			// move the sprite
			this.x = newX;
			this.y = newY;
		},

		// drawing function
		draw: function()
		{
			// calculate tile offset
			tileOffset = tileSize / 2;

			// reset the context
			context.reset();

			// draw the sprite image if it exists
			if (this.image)
			{
				context.translate(this.x + tileOffset,
					   	this.y + tileOffset);
				context.rotate(this.rotation);
				context.translate();
				context.drawImage(this.image,
					-1 * (tileOffset - this.offset), 
					-1 * (tileOffset - this.offset));
				context.reset();
			}

			// draw the order lines if they exist
			if (this.order)
			{
				context.beginPath();

				// set up line drawing
				context.lineWidth = 1;
				context.strokeStyle = "#00CC00";

				// draw the line
				context.moveTo(this.x + tileOffset, this.y + tileOffset);
				context.lineTo(this.order.x + tileOffset,
					   	this.order.y + tileOffset);
				context.stroke();

				// reset
				context.reset();

			}

		},

		// order registration
		registerOrder : function(order)
		{
			// snap the order position
			var snapCoords = snapToGrid(order.x, order.y);
			order.x = snapCoords.x;
			order.y = snapCoords.y;

			order.owner = this;
			this.order = order;
		},

		// carry out orders function
		carryOut : function()
		{
			if (this.order)
				this.moveTo(this.order.x, this.order.y);
			this.order = null;
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
