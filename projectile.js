// code file for projectile managers

function ISIS_ProjectileManager (sprite_manager, particle_manager) {
	var manager_proto = new ISIS_manager();
	var projectile_prototype = {
		__proto__ : manager_proto.type_proto,
		update : function (elapsed) {
			if (this.sprite === null) {
				this.dispose();
				return;
			}

			if (this.target.destroyed) {
				this.hit = false;
				this.done = true;
			}

			var ownView = this.owner.fleetView;
			var targetView = this.target.fleetView;
			var inOwn = ownView.boundSprite(this.sprite);
			var inView = targetView.boundSprite(this.sprite);

			if (!inOwn) {
				if (inView) {
					this.visible = true;
				} else {
					this.visible = false;
				}
			}

			if (!inOwn && !inView) {

				if (this.done) {
					this.dispose();
					return;
				} else if (this.distance > 0) {
					this.distance -= this.weapon.proj_speed;
				} else {
					this.visible = true;
					var randY = targetView.position.y +
						Math.random() * targetView.dimensions.y;
					var initX = targetView.position.x;

					if (this.displacement.x < 0) {
						initX += targetView.dimensions.x;
					}

					var spawnPoint = {x: initX, y: randY};
					this.sprite.moveTo(spawnPoint);
					var vector =
						Math.calcVector(spawnPoint, this.target.position);

					vector.x *= this.weapon.proj_speed;
					vector.y *= this.weapon.proj_speed;
					this.displacement = vector;

					this.sprite.rotation = Math.calcVectorAngle(vector);

					console.log (this.sprite.rotation);

					this.incoming = true;
					inView = true;
				}
			}

			this.sprite.hidden = !this.visible

			if (this.incoming) {
				if (this.target.collide(this.position) && !this.done) {
					this.done = true;
					this.spawnHitText();
					if (this.hit) {
						console.log(this.weapon.name  +" hits " +
							this.target.name + " for " + this.weapon.damage +
							" points of damage");
						this.target.takeDamage(this.weapon.damage,
							this.position);
						this.dispose();
					} else {
						console.log(this.weapon.name + " misses " +
							this.target.name);
					}
				}
			}

			if (this.incoming && !inView) {
				this.dispose();
			}

			if ((!this.done || !this.hit) && this.visible) {
				this.sprite.move(this.displacement);
				this.position = this.sprite.position;
			}

		},

		spawnHitText : function () {
			var hitText = "" + (this.hit ? this.weapon.damage : "Miss");
			var sprite = sprite_manager.newTextSprite(hitText, "14pt Courier",
				"#888888");
			var destination = {x: this.position.x, y: this.position.y - 15};
			particle_manager.create(sprite, this.position, destination,
				1500, 0, true);
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
				new_projectile.done = false;
				new_projectile.weapon = weapon;
				new_projectile.owner = weapon.owner;

				sprite.centerOn(origin);
				new_projectile.position = sprite.position;
				new_projectile.incoming = false;
				new_projectile.visible = true;
				new_projectile.distance = 3000;

				var vector = Math.calcAngleVector(weapon.owner.getRotation());
				vector.x *= weapon.proj_speed;
				vector.y *= weapon.proj_speed;
				new_projectile.displacement = vector;

				sprite.rotation = weapon.owner.getRotation();

			} else {
				console.log("projectile is missing some arguments");
				new_projectile = null;
			}

			return this.add(new_projectile);

		},

		update : function (elapsed) {
			var index = "";
			var projectile = null;
			for (index in this.object_list){
				projectile = this.object_list[index];

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

		new_projectileManager.object_list = [];

		return new_projectileManager;
	}
}
