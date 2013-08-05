// Code file for hardpoints
var ISIS_hardpoint = function () {
	// prototype
	var hardpoint_proto = {
		// method to isntall the hardpoint to the unit
		install : function (unit) {
			this.unit = unit;
		},
		//method to install a weapon to this hardpoint
		installWeapon : function (weapon) {
			this.weapon = weapon;
			// register the weapon with everything
			if (weapon) {
				if(!weapon.owner && this.unit) {
					weapon.setOwner(this.unit);
				}
				if(!weapon.hardpoint) {
					weapon.install(this);
				}
			}
		},
		// passthrough to target this hardpoint on something
		setTarget: function (order) {
			if (this.weapon) {
				this.weapon.setTarget(order);
			}
		},
		// update method
		update: function (elapsed) {
			if (this.weapon) {
				this.weapon.update(elapsed);
			}
		},
		// method to get the absolute drawing position of the hardpoint
		getAbsolutePosition: function () {
			if (this.unit) {
				// rotate the position vector by the ship angle
				var rotated =
					Math.rotateVector(this.position, this.unit.rotation);
				// offset from the ship's position
				return Math.addVectors(this.unit.position, rotated);
			} else {
				throw "cannot get absolute position of uninstalled hardpoint."
			}
		}
	};

	Hardpoint =  function (params) {
		this.__proto__ = hardpoint_proto;

		if (params["position"]) {
			this.position = params["position"];
			this.weapon = null;
			if (params["unit"]) {
				this.install(params["unit"]);
			}
			if (params["weapon"]) {
				this.installWeapon(params["weapon"]);
			}
		} else {
			throw "Cannot instatiate hardpoint without a position"
		}

	};

	return Hardpoint;
};
