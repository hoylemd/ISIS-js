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

		// fire weapon
		fire : function (attack) {
			var roll;
			var dodge;
			var target;
			target = attack.target;

			// do attack roll
			roll = Math.d100();
			dodge = target.dodge();

			// damage, if applicable
			if (roll + this.attackBonus > 50 + dodge)
			{
				console.log(this.name + " hits(" + roll + "/"
					+ (50 + dodge) + ") " + target.name + " for "
					+ this.damage +" points of damage");
				target.takeDamage(this.damage);
			}
			else
			{
				console.log(this.name + " misses(" + roll + "/" +
					(50 + dodge) + ") " + target.name);
			}

			// play animation
		},

		// carry out orders function
		carryOut : function()
		{
			var attack = this.orders.attack;
			// attack order
			if (attack)
			{
				this.fire(attack);
			}
			this.orders.attack = null;
		},

		// damage ship
		takeDamage : function(amount)
		{
			this["hullCurrent"] -= amount;

			if (this["hullCurrent"] <= 0)
			{
				console.log("Unit " + this["name"] + " destroyed!");
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
		}
	}

	// builder function for unit
	return function(sprite)
	{
		// build the prototyoe
		var new_unit =  {
			__proto__ : unit_prototype
		};

		// add the name
		new_unit["name"] = "Unnamed Unit";

		// add the sprite if it exists
		new_unit["sprite"] = sprite;

		// instantiate a new position
		new_unit["position"] = {x: 0, y:0};

		// add the orders object
		new_unit["orders"] = {};

		// default combat stats;
		new_unit["hullMax"] = 5;
		new_unit["hullCurrent"] = 5;
		new_unit["attackBonus"] = 0;
		new_unit["damage"] = 1;
		new_unit["dodgeBonus"] = 10;

		new_unit["destroyed"] = false;

		// return the new unit
		return new_unit;
	}
}
