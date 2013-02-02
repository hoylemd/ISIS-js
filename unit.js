// Unit object source file
// author: hoylemd

// Main setup function
var ISIS_unit = function(context, content, spriteManager, particle_manager)
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
			x: xIn - xOff + (tileSize / 2),
			y: yIn - yOff + (tileSize / 2)
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
			this.sprite.centerOn(this.position);
			var health_bar_y = (newY + 0.5 * this.sprite.frameDims.y) - 15;
			this.health_bar.centerOn({x: newX, y: health_bar_y });
		},

		rotateTo: function(rads)
		{
			this.sprite.rotateTo(rads);
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
					context.moveTo(this.position.x ,this.position.y);
					context.lineTo(this.orders[order].position.x,
							this.orders[order].position.y);
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
		registerOrder : function (order) {
			if (order.name === "attack")
			{
				order.x = order.target.x;
				order.y = order.target.y;
				order.owner = this;
				this.orders.attack = order;
			}
		},

		// carry out orders function
		carryOut : function () {
			var attack = this.orders.attack;
			// attack order
			if (attack) {
				if (attack.pending) {
					if (this.weapon) {
						this.weapon.setTarget(attack.target);
						attack.pending = false;
					} else {
						console.log(this.name +
							" has no weapon! It cannot attack!");
					}
				}
			} else {
				this.weapon.setTarget(null);
			}
		},

		wreck: function () {
			console.log("Unit " + this.name + " destroyed!");
			this.sprite.dispose();
			this.health_bar.dispose();
			this.destroyed = true;
			this.orders.attack = null;
			this.carryOut();
		},

		// damage ship
		takeDamage : function(amount, position) {
			this.hullCurrent -= amount;

			// spawn debris
			// choose debris texture
			var which = Math.floor(Math.random() * 3);
			var sprite = spriteManager.newSprite(this.debris[which],
				{x: 1, y: 1}, 0);
			// choose rotation & rate
			sprite.setRotation = Math.random();
			var rate = (Math.random() - 0.5) / 5;
			// choose destination
			var destination = {x: position.x + (Math.random() * 300) - 150,
				y: position.y + (Math.random() * 300) - 150};
			var debris_particle = particle_manager.newParticle(sprite,
				position, destination, 1000, rate, true);

			if (this.hullCurrent <= 0) {
				this.wreck();
			}
		},

		dodge : function()
		{
			return Math.dx(this.dodgeBonus);
		},

		// point collision function
		collide : function(point)
		{
			var dx = point.x - (this.position.x - (tileSize / 2));
			var dy = point.y - (this.position.y - (tileSize / 2));

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
			this.health_bar.value = this.hullCurrent / this.hullMax;

			// check if attack order is still valid
			if (this.orders.attack) {
				if (this.orders.attack.target.destroyed) {
					this.orders.attack = null;
				}
			}
		}
	}

	// builder function for unit
	return function(texture, mapDims, msBetweenFrames, debris) {
		// prepare sprites
		var sprite = spriteManager.newSprite(
			(content[texture]), mapDims, msBetweenFrames);
		var health_bar_dims = {x: sprite.frameDims.x * 0.8, y: 10};
		var health_bar = spriteManager.newBarSprite(health_bar_dims,
			"green", "red");

		// build the object
		var new_unit =  {
			__proto__ : unit_prototype,
			// sprites
			debris: debris,
			sprite: sprite,
			health_bar : health_bar,
			// general stuff
			name: "Unnamed Unit",
			position : {x: 0, y:0},
			// combat stats
			orders : {},
			hullMax : 5,
			hullCurrent : 5,
			dodgeBonus : 10,
			weapon : null,
			destroyed : false
		};

		// return the new unit
		return new_unit;
	}
}
