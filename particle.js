// code file for particle managers

function ISIS_ParticleManager () {
	var manager_proto = new ISIS.Manager();

	// particle object prototype
	var particle_prototype = {
		update : function (elapsed) {
			// skip update if there's been no time between updates
			if (!elapsed) {
				return;
			}

			// calculate the movement for this update
			this.remaining = this.remaining - elapsed;
			var speed = elapsed / this.time;
			var displacement = {x: this.vector.x * speed,
				y: this.vector.y * speed};

			// apply the movement animation
			this.sprite.rotate(this.rotation);
			this.sprite.move(displacement);

			// fade, if set
			if (this.fade) {
				this.sprite.setAlpha(this.remaining / this.time);
			}

			// check for continuation
			if (this.remaining <= 0) {
				this.dispose();
			}

		},

		// destructor
		dispose : function () {
			if (this.manager) {
				this.manager.remove(this);
			}
			if (this.sprite) {
				this.sprite.dispose();
			}
		}
	};

	// manager prototype
	var particleManager_prototype = {
		__proto__ : manager_proto,
		create : function (sprite, origin, destination, time, rotation, fade) {
			// prototype the object
			var new_particle = {
				__proto__ : particle_prototype,
				manager : this
			}

			// set the fields
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

			// handle errors
			} else {
				console.log("particle is missing some arguments");
				new_particle = null;
			}

			return this.add(new_particle);
		},

		// constructor for debris type particles from an existing sprite
		newDebris : function(sprite) {
			var position = sprite.center();

			// choose rotation rate
			var rate = (Math.random() - 0.5) / 5;

			// choose destination
			var destination = {x: position.x + (Math.random() * 300) - 150,
				y: position.y + (Math.random() * 300) - 150};

			// cascade into the particle constructor
			this.create(sprite, position, destination, 1000, rate, true);
		},

		// update method
		update : function (elapsed) {
			var index = "";
			var particle = null;
			for (index in this.object_list){
				particle = this.object_list[index];

				particle.update(elapsed);
			}
		}
	}

	return function () {
		this.__proto__ = particleManager_prototype;
	}
}
