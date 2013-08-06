// testing suite for vectors
describe("Vectors", function () {
	// grab the vector class
	var Vector = ISIS_Vector();
	var primitive = {x: 1.5, y: -2};

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
	describe("can be built by", function () {
		it("a primitive vector", function () {
			expect(new Vector(primitive)).toBeVectorClass();
		});
	});
});
