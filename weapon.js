// Weapon object

var ISIS_weapon = function (spriteManager, projectile_manager) {
	// prototype
	var weapon_prototype = {
		setTarget : function (target) {
			this.target = target;
		},

		fire : function () {
			var roll;
			var dodge;
			var hit;
			// do attack roll
			roll = Math.d100();
			dodge = this.target.dodge();
			hit = roll + this.hit_bonus > 50 + dodge;

			// make projectile
			var proj_sprite = spriteManager.newSprite(this.proj_texture,
				{x: 1, y: 1}, 0);
			var fire_point =
				{x: this.owner.position.x, y: this.owner.position.y};

			projectile_manager.create(proj_sprite, fire_point,
				this.target, hit, this);
		},

		registerOwner : function (owner) {
			this.owner = owner;
		},

		update : function (elapsed_ms) {
			// update projectile
			var proj = this.projectile;

			// check for target destroyed
			if (this.target && this.target.destroyed) {
				this.target = null;
			}

			if (this.target) {
				this.current_charge += elapsed_ms;

				if (this.current_charge > this.recycle) {
					this.fire();
					this.current_charge = 0;
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
			new_weapon.current_charge = 0;

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
