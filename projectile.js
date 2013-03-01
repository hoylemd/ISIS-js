// code file for projectile managers

function ISIS_ProjectileManager (sprite_manager, particle_manager) {
	var manager_proto = new ISIS_manager();

	// function to spawn the hit text sprite
	var spawnHitText = function (that) {
		var hitText = "" + (that.hit ? that.weapon.damage : "Miss");
		var sprite = sprite_manager.newTextSprite(hitText, "14pt Courier",
			"#888888");
		var destination = {x: that.position.x, y: that.position.y - 15};
		particle_manager.create(sprite, that.position, destination,
			1500, 0, true);
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
		__proto__ : manager_proto.type_proto,
		currentUpdate : updateOutgoing,
		update : function (elapsed) {
			if (this.currentUpdate) {
				this.currentUpdate = this.currentUpdate(this);
			}
		},
		register : function (manager) {
			this.manager = manager;
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

	// manager prototype
	var projectileManager_prototype = {
		__proto__ : manager_proto,
		type_proto : projectile_prototype,

		create : function (sprite, origin, target, hit, weapon) {
			var new_projectile = {
				__proto__ : projectile_prototype,
				manager : this
			}

			if (sprite && origin && target &&
				(hit != undefined && hit != null) && weapon) {
				new_projectile.sprite = sprite;
				new_projectile.target = target;
				new_projectile.hit = hit;
				new_projectile.weapon = weapon;
				new_projectile.owner = weapon.owner;

				sprite.centerOn(origin);
				new_projectile.position = sprite.position;
				new_projectile.distance = 3000;
				new_projectile.targetView = target.fleetView;

				var vector = Math.calcAngleVector(weapon.owner.rotation);
				vector.x *= weapon.proj_speed;
				vector.y *= weapon.proj_speed;
				new_projectile.displacement = vector;

				sprite.rotation = weapon.owner.rotation;

			} else {
				console.log("projectile is missing some arguments");
				new_projectile = null;
			}

			return this.add(new_projectile);
		},
	}

	// manager constructor
	return function () {
		this.__proto__ = projectileManager_prototype;
		this.object_list = [];
	}
}
