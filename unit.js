// Unit object
var ISIS_UnitManager = function (canvas, content) {
	// get the context
	var context = canvas.getContext("2d");

	// check the params
	if (!context) {
		throw "no context given to Unit class constructor";
	} else if (!content) {
		throw "no content given to Unit class constructor";
	}

	// tile constant
	var tileSize = 100;

	// function to snap coordinates to the grid
	var snapToGrid = function(position) {
		// calculate offset
		var xOff = position.x % tileSize;
		var yOff = position.y % tileSize;

		// return new coords
		return {
			x: position.x - xOff + (tileSize / 2),
			y: position.y - yOff + (tileSize / 2)
		};
	}

	// function for when the unit is destroyed
	var wreck =  function (that) {
		// turn the ship sprite into debris
		new that.manager.particle_manager.Debris(that.sprite);

		console.log("Unit " + that.name + " destroyed!");

		// destroy stuff
		that.health_bar.dispose();
		that.destroyed = true;

		// clear orders
		that.orders.attack = null;
		that.carryOut();
	};

	// prototype
	var unit_prototype = {
		// arbitrary movement method
		moveTo : function (position) {
			var bar_y = 0;
			// snap to the grid
			this.position = snapToGrid(position);

			// move the sprites
			this.sprite.centerOn(this.position);
			bar_y = (this.position.y + 0.5 * this.sprite.dimensions.y) - 15;
			this.health_bar.centerOn({x: this.position.x, y: bar_y });
		},

		move : function (displacement) {
			var newPos = {x: this.position.x + displacement.x,
				y: this.position.y + displacement.y};
			this.moveTo(newPos);
		},

		// arbtrary rotation function
		rotateTo: function(rads) {
			this.sprite.rotateTo(rads);
		},

		// order line drawing method
		drawLines: function() {
			// calculate tile offset
			var tileOffset = tileSize / 2;
			var index = 0;
			var order = null;

			// draw the order lines if they exist
			for (index in this.orders) {
				order = this.orders[index];
				context.reset();

				// set up line drawing
				context.beginPath();
				context.lineWidth = 1;
				context.strokeStyle = order.colour;

				// draw the line
				if (order.pending ) {
					context.dashedLineTo(this.position, order.position,
						[20, 20]);
				} else {
					context.moveTo(this.position.x ,this.position.y);
					context.lineTo(order.position.x, order.position.y);
				}
				context.stroke();
			}
		},

		// weapon registration
		addWeapon : function (weapon) {
			if (weapon) {
				this.weapons.push(weapon);
				weapon.install(this);
			} else {
				throw "Cannot add a null weapon";
			}
		},

		// Hull manipulation
		setHull : function (hull) {
			this.hullMax = hull;
			this.hullCurrent = hull;
		},

		// order registration
		registerOrder : function (order) {
			order.x = order.target.x;
			order.y = order.target.y;
			order.owner = this;
			this.orders[order.name] = order;
		},

		// carry out orders function
		carryOut : function () {
			var attack = this.orders.attack;

			// attack order
			if (this.weapons.length > 0) {
				if (attack) {
					if (attack.pending) {
						for (var i in this.weapons) {
							this.weapons[i].setTarget(attack.target);
						}
						attack.pending = false;
					}
				} else {
					for (var i in this.weapons) {
						this.weapons[i].setTarget(null);
					}
				}
			}
		},

		// damage ship
		takeDamage : function (amount, position) {
			var texture = null;
			var sprite = null;
			this.hullCurrent -= amount;

			// spawn debris
			texture = this.debris[Math.floor(Math.random() * 3)];
			sprite = new this.manager.sprite_manager.Sprite(
				texture, {x: 1, y: 1}, 0);

			// positioning
			sprite.setRotation = Math.random();
			sprite.centerOn(position);

			// spawn debris
			new this.manager.particle_manager.Debris(sprite);

			// check if the unit is wrecked
			if (this.hullCurrent <= 0) {
				wreck(this);
			}
		},

		// function to get a units dodge roll
		dodgeRoll : function () {
			return Math.dx(this.dodgeBonus);
		},

		// point collision function
		collide : function(point) {
			var dx = point.x - (this.position.x - (tileSize / 2));
			var dy = point.y - (this.position.y - (tileSize / 2));

			var collision = ((dx > 0 && dx < tileSize) &&
				(dy > 0 && dy < tileSize)) && !this.destroyed;

			return collision;

		},

		// order cancelling function
		clearOrder : function(key) {
			delete this.orders[key];
		},

		// update function
		update : function (elapsed_ms) {
			// update children
			if (this.weapons.length > 0) {
				for (var i in this.weapons) {
					this.weapons[i].update(elapsed_ms);
				}
			}
			this.health_bar.value = this.hullCurrent / this.hullMax;

			// run AI if it exists
			if (this.AI) {
				this.AI();
			}

			// check if attack order is still valid
			if (this.orders.attack) {
				if (this.orders.attack.target.destroyed) {
					delete this.orders.attack;
				}
			}

			// update positioning
			this.position = this.sprite.center();
			this.rotation = this.sprite.rotation;
		},

		// function to register the fleetView
		registerView : function (fleetView) {
			this.fleetView = fleetView;
		},

		// destructor
		dispose : function () {
			// clean up sprites
			this.health_bar.dispose();
			delete this.health_bar;
			this.sprite.dispose();
			delete this.sprite;
			this.manager.remove(this);
		}
	}

	// Unit constructor constructor
		unitConstructor = function (manager) {
			return function(texture, mapDims, msBetweenFrames, debris) {

			// prepare sprites
			var sprite = new manager.sprite_manager.Sprite(
				content.images[texture], mapDims, msBetweenFrames);
			var health_bar_dims = {x: sprite.dimensions.x * 0.8, y: 10};
			var health_bar = new manager.sprite_manager.BarSprite(health_bar_dims,
				"green", "red", "yellow", 0.2);

			// build the object
			this.__proto__ = unit_prototype;

			// link to the manager
			this.manager = manager;

			// sprites
			this.debris= debris;
			this.sprite= sprite;
			this.health_bar = health_bar;

			// general stuff
			this.name= "Unnamed Unit";
			this.position = sprite.position;
			this.rotation = sprite.rotation;
			this.fleetView = null;

			// combat stats
			this.orders = {};
			this.hullMax = 5;
			this.hullCurrent = 5;
			this.dodgeBonus = 10;
			this.weapons = [];
			this.destroyed = false

			// add to the manager
			manager.add(this);

		};
	};

	var checkCollisions = function (point) {
		var colliders = [];
		for (var i in this.object_list) {
			var current = this.object_list[i];
			if (current.collide && current.collide(point)) {
				colliders.push(current);
			}
		}

		return colliders;
	};

	return function (spriteManager, particle_manager){
		this.__proto__ = new ISIS.Manager();
		this.type_proto = unit_prototype;
		this.sprite_manager = spriteManager;
		this.particle_manager = particle_manager;

		this.checkForCollisions = checkCollisions;
		this.Unit = unitConstructor(this);

		this.canvas = canvas;
	};
}
