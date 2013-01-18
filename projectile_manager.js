// code file for projectile managers

function ISIS_ProjectileManager (Projectile) {
	var projectileManager_prototype = {
		addProjectile : function(proj, id) {
			var newId = this.numProjectiles;

			if(proj && this.projectileList) {
				this.projectileList[newId] = proj;
				this.numProjectiles += 1;
				proj.register(this);
				return proj;
			} else {
				return null;
			}
		},

		newProjectile : function (sprite, origin, target, hit, weapon) {
			var new_projectile =
				Projectile(sprite, origin, target, hit, weapon);
			return this.addProjectile(new_projectile);

		},

		removeProjectile : function (projectile) {
			var index = 0;

			if (projectile && this.projectileList) {
				for (index in this.projectileList) {
					if (this.projectileList[index] === projectile) {
						this.projectileList.splice(index, 1);
						this.numProjectiles -= 1;
					}
				}
			}
		},

		update : function (elapsed) {
			var index = "";
			var projectile = null;
			for (index in this.projectileList){
				projectile = this.projectileList[index];

				if (projectile) {
					projectile.update(elapsed);
				}
			}
		}
	}

	return function () {
		var new_projectileManager = {
			__proto__: projectileManager_prototype
		};

		new_projectileManager.numProjectiles = 0;
		new_projectileManager.projectileList = [];

		return new_projectileManager;
	}
}
