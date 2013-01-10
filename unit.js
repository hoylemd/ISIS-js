// Unit object source file
// author: hoylemd

// Main setup function
var ISIS_unit = function(context, content, spriteManager)
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
			this.sprite.moveTo(this.position);

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

		// weapon registration
		addWeapon : function (weapon) {
			if (weapon) {
				this.weapon = weapon;
				weapon.registerOwner(this);
			}
		},

		// Hull manipulation
		setHull : function (hull) {
			this.hullMax = hull;
			this.hullCurrent = hull;
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
			var attack = this.orders.attack;
			// attack order
			if (attack)
			{
				if (this.weapon) {
					this.weapon.fire(attack.target);
				} else {
					console.log(this.name + " has no weapon! It cannot attack!");
				}
			}
			this.orders.attack = null;
		},

		// damage ship
		takeDamage : function(amount)
		{
			this.hullCurrent -= amount;

			if (this.hullCurrent <= 0)
			{
				console.log("Unit " + this.name + " destroyed!");
				this.sprite.destruct();
				this.destroyed = true;
			}
		},

		dodge : function()
		{
			return Math.dx(this.dodgeBonus);
		},

		// point collision function
		collide : function(point)
		{
			var dx = point.x - this.position.x;
			var dy = point.y - this.position.y;

			return ((dx > 0 && dx < tileSize) &&
				(dy > 0 && dy < tileSize)) && !this.destroyed;

		},

		// order cancelling function
		clearOrder : function(order)
		{
			this.orders[order] = null;
		},

		// update function
		update : function (elapsed_ms) {
			// update children
			this.weapon.update(elapsed_ms);
		}
	}

	// builder function for unit
	return function(texture, mapDims, msBetweenFrames)
	{
		// build the prototyoe
		var new_unit =  {
			__proto__ : unit_prototype
		};

		// add the name
		new_unit.name = "Unnamed Unit";

		// add the sprite if it exists
		new_unit.sprite = spriteManager.newSprite(
			(content[texture]), mapDims, msBetweenFrames);

		// instantiate a new position
		new_unit.position = {x: 0, y:0};

		// add the orders object
		new_unit.orders = {};

		// default combat stats;
		new_unit.hullMax = 5;
		new_unit.hullCurrent = 5;
		new_unit.dodgeBonus = 10;

		// default weapon
		new_unit.weapon = null;

		new_unit.destroyed = false;

		// return the new unit
		return new_unit;
	}
}
