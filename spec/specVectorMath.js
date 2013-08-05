// Test suite for the Vector Math functions of Utils
describe("Vector Math", function () {
	// set the inverted y flag
	beforeEach(function() {
		Math.invertY = true;
	});

	// set up test values
	var west_south_west = {
		unit: {x: -0.9239, y: 0.3827},
		angle: 11/16 * Math.TAU
	};
	var west = {
		unit: {x: 1, y: 0},
		angle: 1/4 * Math.TAU
	};
	var north = {
		vector: {x: 0, y: -2.45},
		unit: {x: 0, y: -1},
		magnitude: 2.45,
		angle: 0
	};

	// test for the value of Math.TAU
	describe ("Tau", function () {
		it("should be about 6.2831", function() {
			expect(Math.TAU).toBeCloseTo(6.2831, 3);
		});
	});

	// test 4 point precision converter
	describe("4 point precision converter", function() {
		var very_small = 0.00002342442;
		it("converts a number with more than 4 decimal places to 4 decimal places", function() {
			expect(Math.toPrecision4(Math.PI)).toEqual(3.1416);
		});
		it("converts a number between 0 and 0.00009-> to 0", function () {
			expect(Math.toPrecision4(very_small)).toEqual(0);
		});
	});

	// test angle normalization
	describe ("Normalize Angle", function () {
		// stage the test data
		var larger = 3.25 * Math.TAU, larger_expected = 1.5708;
		var smaller = -0.5 * Math.TAU, smaller_expected = 3.1416;
		var too_precise = 0.65 * Math.TAU; too_precise_expected = 4.0841;

		// run tests
		it("converts an angle greater than Tau radians to be between 0 and Tau radians", function() {
			expect(Math.normalizeAngle(larger)).toBeCloseTo(larger_expected, 4);
		});
		it("converts an angle less than 0 radians to be between 0 and Tau radians", function() {
			expect(Math.normalizeAngle(smaller)).toBeCloseTo(smaller_expected, 4);
		});
		it("normalizes angles to 4 precision points", function () {
			expect(Math.normalizeAngle(too_precise)).toEqual(Math.toPrecision4(too_precise_expected));
		});
	});

	// test angle to unit vector conversion
	describe ("angle to unit vector conversion", function () {

		it("converts a north angle to {0, -1}", function () {
			expect(Math.calcAngleVector(north.angle)).toEqual(north.unit);
		});
		it("converts a west angle to {1, 0}", function () {
			expect(Math.calcAngleVector(west.angle)).toEqual(west.unit);
		});
		it("converts an east-south-east angle to {-0.9239, 0.3827}", function () {
			expect(Math.calcAngleVector(west_south_west.angle)).toEqual(west_south_west.unit);
		});
	});

	// test vector to unit vector conversion
	describe ("vector to unit vector conversion", function () {
		it("leaves a unit vector as a unit vector", function () {
			var output = Math.calcUnitVector(north.unit);
			expect(output).toEqual(north.unit);
		});
		it("converts a north vector to a north unit vector", function () {
			expect(Math.calcUnitVector(north.vector)).toEqual(north.unit);
		});
	});
});
