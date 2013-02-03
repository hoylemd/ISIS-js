// code file for particle object

var ISIS_Particle = function() {
	var particle_prototype = {
		checkContinue : function (displacement) {
			var dX = Math.abs(this.destination.x - this.sprite.position.x);
			var dY = Math.abs(this.destination.y - this.sprite.position.y);

			return (dX > Math.abs(displacement.x) &&
				dY > Math.abs(displacement.y));
		},

		update : function (elapsed) {
			if (!elapsed) {
				return;
			}

			this.remaining -= elapsed;
			var speed = elapsed / this.time;
			var displacement = {x: this.vector.x * speed,
				y: this.vector.y * speed};

			if (this.sprite === null || this.done) {
				this.dispose();
				return;
			}

			this.done = !this.checkContinue(displacement);

			if (this.rotation) {
				this.sprite.rotate(this.rotation);
			}

			if (this.fade) {
				this.sprite.alpha = this.remaining / this.time;
			}

			this.sprite.move(displacement);
		},

		register : function (manager) {
			this.manager = manager;
		},

		dispose : function () {
			if (this.manager) {
				this.manager.removeParticle(this);
			}
			if (this.sprite) {
				this.sprite.dispose();
			}
		}
	};

	return function (sprite, origin, destination, time, rotation, fade) {
		var new_particle = {
			__proto__ : particle_prototype
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

		return new_particle;
	}
};
