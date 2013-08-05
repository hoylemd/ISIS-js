// Test suite for the Vector Math functions of Utils
describe("Vector Math", function () {
	// test for the value of Math.TAU
	describe ("Tau", function () {
		it("should be about 6.2831", function() {
			expect(Math.TAU).toBeCloseTo(6.2831, 3);
		});
	});

	// test 4 point precision converter
	describe("4 point precision converter", function() {
		it("converts a number with more than 4 decimal places to 4 decimal places", function() {
			expect(Math.toPrecision4(3.141596)).toEqual(3.1416);
		});
		it("converts a number between 0 and 0.00009-> to 0", function () {
			expect(Math.toPrecision4(0.00002342442)).toEqual(0);
		});
	});

	// test angle normalization
	describe ("Normalize Angle", function () {
		it("converts an angle greater than Tau radians to be between 0 and Tau radians", function() {
			expect(Math.normalizeAngle(3.25 * Math.TAU)).toBeCloseTo(0.25 * Math.TAU, 4);
		});
		it("converts an angle less than 0 radians to be between 0 and Tau radians", function() {
			expect(Math.normalizeAngle(-0.5 * Math.TAU)).toBeCloseTo(0.5 * Math.TAU, 4);
		});
		it("does not change an angle between 0 and Tau rads", function () {
			expect(Math.normalizeAngle(0.65 * Math.TAU)).toEqual(0.65 * Math.TAU);
		});
	});

	// test angle to unit vector conversion
	describe ("angle to unit vector conversion", function () {
		beforeEach(function() {
			Math.invertY = true;
		});

		it("converts a north angle to {0, -1}", function () {
			expect(Math.calcAngleVector(0)).toEqual({x: 0, y: -1});
		});
		it("converts a west angle to {1, 0}", function () {
			expect(Math.calcAngleVector(3/4 * Math.TAU)).toEqual({x: -1, y: 0});
		});
		it("converts an east-south-east angle to 0 rad", function () {
			expect(Math.calcAngleVector(11 / 16 * Math.TAU)).toBoCloseTO({x: -0.9839, y: 0.3827}, 3);
		});
	});
});
