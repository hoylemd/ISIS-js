// code file for projectile managers

function ISIS_ProjectileManager () {

	// function to spawn the hit text sprite
	var spawnHitText = function (that) {
		var hitText = "" + (that.hit ? that.weapon.damage : "Miss");
		var sprite = new that.manager.sprite_manager.TextSprite({
			"text": hitText,
			"font": "16px Laconic",
			"colour": "#888888"
		});
		sprite.centerOn(that.position);
		var destination = {x: that.position.x, y: that.position.y - 15};
		new that.manager.particle_manager.Particle(
			sprite, destination, 1500, 0, true);
	};

	// update function for missed projectules
	var updateMissed = function (that) {
		that.sprite.move(that.displacement);
		that.position = that.sprite.position;

		if (that.target.fleetView.boundSprite(that.sprite)) {
			return updateMissed;
		} else {
			that.dispose();
			return null;
		}
	};

	// transition function for when the projectile collides with it's target
	var transitionCollision = function (that) {
		spawnHitText(that);
		if (that.hit) {
			console.log(that.weapon.name  +" hits " + that.target.name +
				" for " + that.weapon.damage + " points of damage");
			that.target.takeDamage(that.weapon.damage, that.position);
			that.dispose();
			return null;
		} else {
			console.log(that.weapon.name + " misses " + that.target.name);
			return updateMissed;
		}
	};

	// update function for incoming projectiles
	var updateIncoming = function (that) {
		that.sprite.move(that.displacement);
		that.position = that.sprite.position;

		if (that.target.collide(that.position)) {
			return transitionCollision(that);
		} else {
			return updateIncoming;
		}
	};

	// prepare the transition from in-transit to incoming
	var transitionIncoming = function (that) {
		var randY = that.targetView.position.y +
			Math.random() * that.targetView.dimensions.y;
		var initX = that.targetView.position.x;
		var spawn_point = null;
		var vector = null;

		if (that.displacement.x < 0) {
			initX += that.targetView.dimensions.x;
		}

		spawn_point = {x: initX, y: randY};

		that.sprite.hidden = false;
		that.sprite.moveTo(spawn_point);

		vector = Math.calcVector(spawn_point, that.target.position);

		vector.x *= that.weapon.proj_speed;
		vector.y *= that.weapon.proj_speed;
		that.displacement = vector;

		that.sprite.rotation = Math.calcVectorAngle(vector);

		return updateIncoming;
	};

	// update function for when the projectile is in transit between fleets
	var updateInTransit = function (that) {
		that.distance -= that.weapon.proj_speed;

		if (that.distance > 0) {
			return updateInTransit;
		} else {
			return transitionIncoming(that);
		}
	};

	// update function for when the projectile is leaving it's parent
	var updateOutgoing = function (that) {
		that.sprite.move(that.displacement);
		that.position = that.sprite.position;

		if (that.owner.fleetView.boundSprite(that.sprite)) {
			return updateOutgoing;
		} else {
			that.sprite.hidden = true;
			return updateInTransit;
		}
	};

	// encapsulated prototype
	var projectile_prototype = {
		currentUpdate : updateOutgoing,
		update : function (elapsed) {
			if (this.currentUpdate) {
				this.currentUpdate = this.currentUpdate(this);
			}
		},

		dispose : function () {
			if (this.manager) {
				this.manager.remove(this);
			}
			if (this.sprite) {
				this.sprite.dispose();
			}
		}
	};

	// Constructor constructor
	var projectileConstructor = function (manager) {
		return function (sprite, origin, target, hit, weapon) {
			// chack the args
			if (sprite && origin && target && weapon) {
				// prototype it
				this.__proto__ = projectile_prototype;
				this.manager = manager;

				// set the links
				this.sprite = sprite;
				this.target = target;
				this.hit = hit ? true : false;
				this.weapon = weapon;
				this.owner = weapon.owner;

				manager.add(this);

				// position the sprite
				sprite.centerOn(origin);
				this.position = sprite.position;
				this.distance = 3000;
				this.targetView = target.fleetView;
				sprite.rotation = weapon.owner.rotation;

				// calculate vectors
				var vector = Math.calcAngleVector(weapon.owner.rotation);
				vector.x *= weapon.proj_speed;
				vector.y *= weapon.proj_speed;
				this.displacement = vector;

			} else {
				// error on bad args
				console.log("projectile is missing some arguments");
			}
		};
	};

	// manager constructor
	return function (sprite_manager, particle_manager) {
		this.__proto__ = new ISIS.Manager();
		this.Projectile = projectileConstructor(this);
		this.sprite_manager = sprite_manager;
		this.particle_manager = particle_manager;
		this.object_list = [];
	}
}
