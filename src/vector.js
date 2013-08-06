// vector class
ISIS_Vector = function () {
	// set the function to be used to normalize scalar values
	var scalarNormalizer = Math.toPrecision4;
	var angleNormalizer = Math.normalizeAngle;

	// check if an object is a primitive vector (has an x and y coordinate)
	var isPrimitiveVector = function(object) {
		// check that the object exists
		if (object) {
			// check that it has the correct fields
			if ((object.x || object.x === 0) && (object.y || object.y === 0)) {
				// check that the fields are numeric
				return (isNumeric(object.x) && isNumeric(object.y));
			}
		}
		// fall back to false if any previous conditions fail
		return false;
	};

	// calculate a unit vector primitive from an angle in radians
	var angleToUnitVector = function (angle) {
		// check the input
		if (isNumeric(angle)) {
			// normalize the input
			var theta = angleNormalizer(angle);

			// calculate the unit vector primitive
			var unit_vector = {
				x: scalarNormalizer(Math.sin(theta)),
				y: scalarNormalizer(Math.cos(theta))
			};

			return unit_vector;
		} else {
			throw {
				message: "Attempt to convert non-numeric valye to a unit vector",
				data: angle
			};
		}
	};

	// calculate the angle of a vector primitive
	var vectorToAngle = function (vector) {
		// check input
		if (isVectorPrimitive(vector)) {
			var theta = Math.atan2(vector.x, vector.y);
			return theta;
		} else {
			throw {
				message: "Attempt to convert non-vector primitive to an angle",
				data: vector
			};
		}
	};

	// Calculate a vector's x and y coords from it's other fields
	var calculateCoordinates = function(vector) {
		if (vector) {
			// make sure there is a magnitude, default to unit vector (magnitude 1)
			if (!isNumeric(vector._internals.magnitude)) {
				vector._internals.magnitude = 1;
			}

			// make sure there is a unit vector
			if (!isPrimitiveVector(vector._internals.unit)) {
				// grab it from the angle, if possible
				if (isNumeric(vector._internals.angle)) {
					vector._internals.unit = angleToUnitVector(vector._internals.angle);
				} else {
					// not enough information!
					throw {
						message: "Attempt to calculate vector coordinates without a unit vector " +
							"or angle",
						data: vector
					};
				}
			}

			// multiply the unit vector by the magnitude
			vector._internals.x = vector._internals.x * vector._internals.magnitude;
			vector._internals.y = vector._internals.y * vector._internals.magnitude;

		} else {
			throw {
				message: "Attempt to calculate coordinates of a non-vector",
				data: vector
			};
		}
	};

	// prototype for vectors
	var vector_proto = {
		x : function(new_value) {
			// detect if we are getting or setting
			if (new_value || new_value === 0) {
				this._internals.x = new_value

				// invalidate the other data
				this._internals.unit = null;
				this._internals.magnitude = null;
				this._internals.angle = null;

				return this._internals.x;
			} else {
				// check that the x coord is set
				if (this._internals.x || this.internals.x === 0) {
					return this._internals.x;
				} else {
					throw {
						message: "attempt to read x coord from a vector with no x coord.",
						data: this._internals
					};
				}
			}
		},
		y : function(new_value) {
			// detect if we are getting or setting
			if (new_value || new_value === 0) {
				this._internals.y = new_value

				// invalidate the other data
				this._internals.unit = null;
				this._internals.magnitude = null;
				this._internals.angle = null;

				return this._internals.y;
			} else {
				// check that the y coord is set
				if (this._internals.y || this.internals.y === 0) {
					return this._internals.y;
				} else {
					throw {
						message: "attempt to read y coord from a vector with no y coord.",
						data: this._internals
					};
				}
			}
		},
		// primitive getter/setter
		primitive : function (new_value) {
			// check if we are setting
			if (new_value) {
				// check that the inpit has the requisite fields
				if (isPrimitiveVector(new_value)) {
					this.x(new_value.x);
					this.y(new_value.y);
				}
			}

			// return a primitive vector for this object
			return {
				x: this.x(),
				y: this.y()
			};
		},
		angle: function (new_value) {
			// determine if we are getting or setting
			if (new_value || new_value === 0) {
				this._internals.angle = new_value;

				// invalidate the unit vector
				this._internals.unit = null;

				// recalculate the coordiates
				calculateCoordinates(this);
			}

			return this._internals.angle;
		},
		magnitude: function (new_value) {
			// determine if we are getting or setting
			if (new_value || new_value === 0) {
				this._internals.magnitude = new_value;

				// recalculate the coordinates
				calculateCoordinates(this);
			}

			return this._internals.magnitude;
		},
		unit: function(new_value) {
			if (new_value) {
				if ( isPrimitiveVector(new_value)) {
					// set the new angle
					this.angle(vectorToAngle(new_value));

					// invalidate the current unit vector
					this._internals.unit = null;
				} else {
					throw {
						message: "Attempt to assign a unit vector with an invalid vector primitive",
						data: new_value
					};
				}
			}

			// calculate une unit vector just in time
			if (!this._internals.unit) {
				angleToUnitVector(this);
			}

			return this._internals.unit;
		}
	};

	// Vector constructor
	var constructor =  function (params) {
		this.__proto__ = vector_proto;
		this._internals = {
			x: null,
			y: null,
			magnitude: null,
			angle: null,
			unit: null
		};
		// check if params have been provided
		if (params) {
			// choose which construction method to use
			if (isPrimitiveVector(params)) {
				// x & y coords constructor
				this.x(params.x);
				this.y(params.y);
			} else if (params.unit && params.magnitude) {
				// unit vector & magnitude constructor
				this._internals.unit = params.unit;
				this._internals.magnitiude = params.magnitude;

				// calc out the x and y coords
				calculateCoordinates(this);
			} else if (params.angle && params.magnitude) {
				// angle & magnitude constructor
				this.params.angle;
				this._internals.magnitude = params.magnitude;

				// calc out the x and y coords
				calculateCoordinates(this);
			} else if (isPrimitiveVector(params._internals)) {
				// copy constructor - just copy the internals
				this._internals.x = params._internals.x;
				this._internals.y = params._internals.y;

				this._internals.magnitude = params._internals.magnitude;
				this._internals.angle = params._internals.angle;
				this._internals.unit = {
					x: params._internals.unit.y,
					y: params._internals.unit.y
				};
			} else {
				throw {
					message: "Attempt to create a vector with invalid params",
					data: params
				};
			}
		} else {
			throw {
				message: "Attempt to create a vector without parameters",
				data: {}
			};
		}
	};

	// add the isPrimitiveVector as a static method to Vector
	constructor.isPrimitiveVector = isPrimitiveVector;

	return constructor;
};
