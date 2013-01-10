// Weapon object

var ISIS_weapon = function (spriteManager) {
	// prototype
	var weapon_prototype = {
		fire : function (target) {
			var roll;
			var dodge;

			// do attack roll
			roll = Math.d100();
			dodge = target.dodge();

			// damage, if applicable
			if (roll + this.hit_bonus > 50 + dodge)
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
				proj.disp = {x: this.proj_speed, y: 0.25};
				proj.target = target;
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
				if (proj.target.collide(proj)) {
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
