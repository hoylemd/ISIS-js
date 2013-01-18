// code file for Projectile objects

var ISIS_Projectile = function(game) {
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
				if (this.hit) {
					console.log(this.weapon.name  +" hits " +
						this.target.name + " for " + this.weapon.damage +
						" points of damage");
					this.target.takeDamage(this.weapon.damage);
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
