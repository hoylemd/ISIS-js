// code file for particle object

var ISIS_Particle = function() {
	var particle_prototype = {
		checkContinue : function (displacement) {
			var dX = Math.abs(this.destination.x - this.position.x);
			var dY = Math.abs(this.destination.y - this.position.y);

			return (dX > Math.abs(displacement.x) ||
				dY > Math.abs(displacement.y));
		},

		update : function (elapsed) {
			var speed = elapsed / this.time;
			var displacement = {x: this.vector.y * speed,
				y: this.vector.y * speed};

			if (this.sprite === null || this.done) {
				this.dispose();
				return;
			}

			this.done = this.checkContinue(displacement);

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

	return function (sprite, origin, destination, time)
	{
		var vector = {x: 0, y: 0};
		var new_particle = {
			__proto__ : particle_prototype
		}

		if (sprite && origin && destination && time) {
			new_particle.sprite = sprite;
			new_particle.destination = destination;
			new_particle.done = false;

			sprite.centerOn(origin);
			new_particle.position = sprite.position;

			vector = Math.calcVector(origin, destination);
			new_particle.vector = vector;

		} else {
			console.log("particle is missing some arguments");
			new_particle = null;
		}

		return new_particle;
	}
};
