// Weapon object

var ISIS_weapon = function () {
	// prototype
	var weapon_prototype = {
	};

	// constructor
	return function (damage, hit_bonus, recycle, texture, speed)
	{
		var new_weapon = {
			__proto__ : weapon_prototype
		};

		if (texture) {
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
