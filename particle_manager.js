// code file for particle managers

function ISIS_ParticleManager () {
	var manager_proto = ISIS_manager();
	var particle_prototype = {
		__proto__ : manager_proto.type_proto,
		checkContinue : function (displacement) {
			return this.remaining > 0;
		},

		update : function (elapsed) {
			if (!elapsed) {
				return;
			}
			if (this.sprite === null || this.done) {
				this.dispose();
				return;
			}

			this.remaining = this.remaining - elapsed;
			var speed = elapsed / this.time;
			var displacement = {x: this.vector.x * speed,
				y: this.vector.y * speed};


			this.done = !this.checkContinue(displacement);

			if (this.rotation) {
				this.sprite.rotate(this.rotation);
			}

			if (this.fade) {
				this.sprite.setAlpha(this.remaining / this.time);
			}

			this.sprite.move(displacement);
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

	var particleManager_prototype = {
		__proto__ : manager_proto,
		create :
			function (sprite, origin, destination, time, rotation, fade) {

			var new_particle = {
				__proto__ : particle_prototype,
				manager : this
			}

			if (sprite && origin && destination && time) {
				new_particle.sprite = sprite;
				new_particle.destination = destination;
				new_particle.done = false;
				new_particle.time = time;
				new_particle.remaining = time;
				new_particle.rotation = rotation;
				new_particle.fade = fade;

				sprite.centerOn(origin);
				new_particle.position = sprite.position;

				new_particle.vector = {x: destination.x - origin.x,
					y: destination.y - origin.y};

			} else {
				console.log("particle is missing some arguments");
				new_particle = null;
			}

			return this.add(new_particle);
		},

		newDebris : function(sprite) {
			var position = sprite.center();
			// choose rotation & rate
			var rate = (Math.random() - 0.5) / 5;
			// choose destination
			var destination = {x: position.x + (Math.random() * 300) - 150,
				y: position.y + (Math.random() * 300) - 150};
			this.create(sprite, position, destination, 1000, rate, true);
		},

		update : function (elapsed) {
			var index = "";
			var particle = null;
			for (index in this.object_list){
				particle = this.object_list[index];

				if (particle) {
					particle.update(elapsed);
				}
			}
		}
	}

	return function () {
		var new_particleManager = {
			__proto__: particleManager_prototype
		};

		return new_particleManager;
	}
}
