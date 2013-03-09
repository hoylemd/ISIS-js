// code file for particle managers

function ISIS_ParticleManager () {
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

	// particle constructor
	var particleConstructor = function (manager) {
		return function (sprite, destination, time, rotation, fade) {
			// set the fields
			if (sprite && destination && time) {

				// link to other objects
				this.__proto__ = particle_prototype;
				manager.add(this);
				this.manager = manager;
				this.sprite = sprite;

				// set up animation
				this.destination = destination;
				this.done = false;
				this.time = time;
				this.remaining = time;
				this.rotation = rotation;
				this.fade = fade;
				this.position = sprite.position;
				this.vector = {x: destination.x - sprite.position.x,
					y: destination.y - sprite.position.y};

			// handle errors
			} else {
				console.log("particle is missing some arguments");
			}
		};
	};

	// debris constructor
	var debrisConstructor = function (manager) {
		return function(sprite) {
			var position = sprite.center();

			// choose rotation rate
			var rate = (Math.random() - 0.5) / 5;

			// choose destination
			var destination = {x: position.x + (Math.random() * 300) - 150,
				y: position.y + (Math.random() * 300) - 150};

			// cascade into the particle constructor
			this.__proto__ = new manager.Particle(sprite, destination, 1000,
				rate, true);
		};

	};

	// manager constructor
	return function () {
		this.__proto__ = new ISIS.Manager();
		this.Particle = particleConstructor(this);
		this.Debris = debrisConstructor(this);
	}
}
