describe("Vector Math", function () {
	describe ("Tau", function () {
		it("should be about 6.2831", function() {
			expect(Math.TAU).toBeCloseTo(6.2831, 3);
		});
	});
	describe ("Normalize Angle", function () {
		it("converts an angle in radians to be between 0 and Tau radians", function() {
			expect(Math.normalizeAngle(3.25 * Math.TAU)).toBeCloseTo(0.25 * Math.TAU, 4);
		});
	});

});
