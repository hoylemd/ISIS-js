// Weapon object

var ISIS_weapon = function () {
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

		} else {
			new_weapon = null;
		}
			return new_weapon;
	}

}
