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


		},

		drawLines: function()
		{
			// calculate tile offset
			tileOffset = tileSize / 2;
			
			// draw the order lines if they exist
			for (var order in this.orders)
			{
				if (this.orders[order])
				{
					context.beginPath();

					// set up line drawing
					context.lineWidth = 1;
					context.strokeStyle = this.orders[order].colour;

					// draw the line
					context.moveTo(this.x + tileOffset, this.y + tileOffset);
					context.lineTo(this.orders[order].x + tileOffset,
							this.orders[order].y + tileOffset);
					context.stroke();

					// reset
					context.reset();
				}
			}
		},

		// order registration
		registerOrder : function(order)
		{
			// register move order
			if (order.name === "move")
			{
				// snap the order position
				var snapCoords = snapToGrid(order.x, order.y);
				order.x = snapCoords.x;
				order.y = snapCoords.y;

				order.owner = this;
				this.orders.move = order;
			}
			// register attack order
			else if (order.name === "attack")
			{
				order.x = order.target.x;
				order.y = order.target.y;
				order.owner = this;
				this.orders.attack = order;
			}
		},

		// carry out orders function
		carryOut : function()
		{
			// move order
			if (this.orders.move)
				this.moveTo(this.orders.move.x, this.orders.move.y);

			// attack order
			if (this.orders.attack)
				this.orders.attack.hp -= 1;

			this.orders.move = null;
			this.orders.attack = null;
		},

		// point collision function
		collide : function(point)
		{
			var dx = point.x - this.x;
			var dy = point.y - this.y;
			return ((dx > 0 && dx < tileSize) &&
				(dy > 0 && dy < tileSize));
		
		},

		// order cancelling function
		clearOrder : function(order)
		{
			this.orders[order] = null;
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

		// add the orders object
		new_unit.orders = {};

		// return the new unit
		return new_unit;
	}
}
