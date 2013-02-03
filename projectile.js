// code file for Projectile objects

var ISIS_Projectile = function(particle_manager, sprite_manager) {
	var projectile_prototype = {
		update : function (elapsed) {
			if (this.sprite === null) {
				this.dispose();
				return;
			}

			if (this.target.destroyed) {
				this.hit = false;
			}

			if (this.target.collide(this.position) && !this.done) {
				this.done = true;
				this.spawnHitText();
				if (this.hit) {
					console.log(this.weapon.name  +" hits " +
						this.target.name + " for " + this.weapon.damage +
						" points of damage");
					this.target.takeDamage(this.weapon.damage, this.position);
					this.dispose();
				} else {
					console.log(this.weapon.name + " misses " +
						this.target.name);
				}
			}

			if (this.position.x > 1100) {
				this.dispose();
			}

			if (!this.done || !this.hit) {
				this.sprite.move(this.displacement);
			}
		},

		spawnHitText : function () {
			var hitText = "" + (this.hit ? this.weapon.damage : "Miss");
			var sprite = sprite_manager.newTextSprite(hitText, "14pt Courier",
				"#888888");
			var destination = {x: this.position.x, y: this.position.y - 15};
			particle_manager.newParticle(sprite, this.position, destination,
				1500, 0, true);
		},

		register : function (manager) {
			this.manager = manager;
		},

		dispose : function () {
			if (this.manager) {
				this.manager.removeProjectile(this);
			}
			if (this.sprite) {
				this.sprite.dispose();
			}
		}
	};

	return function (sprite, origin, target, hit, weapon)
	{
		var new_projectile = {
			__proto__ : projectile_prototype
		}

		if (sprite && origin && target &&
			(hit != undefined && hit != null) && weapon) {
			new_projectile.sprite = sprite;
			new_projectile.target = target;
			new_projectile.hit = hit;
			new_projectile.done = false;
			new_projectile.weapon = weapon;

			sprite.centerOn(origin);
			new_projectile.position = sprite.position;

			var vector = Math.calcVector(origin, target.position);
			vector.x *= weapon.proj_speed;
			vector.y *= weapon.proj_speed;
			new_projectile.displacement = vector;

			sprite.rotation = Math.calculateLineAngle(origin, target.position);

		} else {
			console.log("projectile is missing some arguments");
			new_projectile = null;
		}

		return new_projectile;
	}
};
