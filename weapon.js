// Weapon object

var ISIS_weapon = function (spriteManager) {
	// prototype
	var weapon_prototype = {
		fire : function (target) {
			var roll;
			var dodge;
			var hit;
			// do attack roll
			roll = Math.d100();
			dodge = target.dodge();
			hit = roll + this.hit_bonus > 50 + dodge;

			// damage, if applicable
			if (hit)
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
			if (this.proj_texture != null) {
				var proj = spriteManager.newSprite(
					this.proj_texture, {x: 10, y:5}, 33);
				proj.centerOn(this.owner.position);
				var vector = Math.calcVector(proj.position, target.position);
				proj.disp = {x: vector.x * this.proj_speed,
					y: vector.y * this.proj_speed};
				proj.rotation =
					Math.calculateLineAngle(proj.position, target.position);
				proj.target = target;
				proj.hit = hit;
				this.projectile = proj;
			}
		},

		registerOwner : function (owner) {
			this.owner = owner;
		},

		update : function (elapsed_ms) {
			// update projectile
			var proj = this.projectile;
			if (proj) {
				if (proj.target.collide(proj.position) && proj.hit) {
					proj.destruct();
					this.projectile = null;
				} else {
					proj.move(this.projectile.disp);
				}
			}

		}
	};

	// constructor
	return function (name, damage, hit_bonus, recycle, texture, speed)
	{
		var new_weapon = {
			__proto__ : weapon_prototype
		};

		if (texture) {
			new_weapon.name = name;

			new_weapon.damage = damage;
			new_weapon.hit_bonus = hit_bonus;
			new_weapon.recycle = recycle;

			new_weapon.proj_texture = texture;
			new_weapon.proj_speed = speed;

			new_weapon.owner = null;
			new_weapon.projectile = null;

		} else {
			new_weapon = null;
		}
			return new_weapon;
	}

}
