// testing suite for vectors
describe("Vectors", function () {
	// grab the vector class
	var Vector = ISIS_Vector();
	var unit_and_magnitude = {unit: {x: 1, y: 0}, magnitude: 2.5};

	// add the vector class matcher
	beforeEach(function() {
	  this.addMatchers({
		toBeVectorClass: function(expectedSong) {
		  var obj = this.actual;
		  return Vector.isPrimitiveVector(obj._internals);
		}
	  });
	});

	// test constructors
	describe("constructed by a primitive vector", function () {
		var primitive = {x: 1.5, y: -2};
		var magnitude = 2.5;
		var vector = new Vector(primitive);
		it("creates a vector object", function () {
			expect(vector).toBeVectorClass();
		});
		it("calculates the magnitude on-the-fly", function () {
			expect(vector._internals.magnitude).toBeNull();
			expect(vector.magnitude()).toEqual(magnitude);
		});
	});
	describe("constructed by a unit vector and magnitude", function () {
		it("creates a vector object", function() {
			expect(new Vector(unit_and_magnitude)).toBeVectorClass();
		});
	});
});
