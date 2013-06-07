var ISIS_hardpoint = function () {
	var hardpoint_proto = {
		install : function (unit) {
			this.unit = unit;
		},
		installWeapon : function (weapon) {
			this.weapon = weapon;
			if (weapon) {
				if(!weapon.owner && this.unit) {
					weapon.setOwner(this.unit);
				}
				if(!weapon.hardpoint) {
					weapon.install(this);
				}
			}
		},
		setTarget: function (order) {
			if (this.weapon) {
				this.weapon.setTarget(order);
			}
		},
		update: function (elapsed) {
			if (this.weapon) {
				this.weapon.update(elapsed);
			}
		},
		getAbsolutePosition: function () {
			if (this.unit) {
				var rotated =
					Math.rotateVector(this.position, this.unit.rotation);
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
