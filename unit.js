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
		position: {x:0, y:0},
		name : "Unnamed Unit",
		
		// sprite drawing data
		offset : 0,

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

			this.position.x = newX;
			this.position.y = newY;

			// move the sprite
			if (this.sprite)
			{
				this.sprite.moveTo(this.position);
			}

		},

		rotate: function(rads)
		{
			this.sprite.rotate(rads);
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
					context.reset();
					context.beginPath();

					// set up line drawing
					context.lineWidth = 1;
					context.strokeStyle = this.orders[order].colour;

					// draw the line
					context.moveTo(this.position.x + tileOffset, 
							this.position.y + tileOffset);
					context.lineTo(this.orders[order].position.x + tileOffset,
							this.orders[order].position.y + tileOffset);
					context.stroke();

					// reset
					context.reset();
				}
			}
		},

		// order registration
		registerOrder : function(order)
		{
			if (order.name === "attack")
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
			// attack order
			if (this.orders.attack)
				this.orders.attack.hp -= 1;

			this.orders.attack = null;
		},

		// point collision function
		collide : function(point)
		{
			var dx = point.x - this.position.x;
			var dy = point.y - this.position.y;

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
	return function(sprite)
	{
		// build the prototyoe
		var new_unit =  {
			__proto__ : unit_prototype
		};
		
		// add the sprite if it exists
		new_unit["sprite"] = sprite;

		// instantiate a new position
		new_unit.position = {x: 0, y:0};

		// add the orders object
		new_unit.orders = {};

		// return the new unit
		return new_unit;
	}
}
