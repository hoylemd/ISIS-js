// testing suite for vectors
describe("Vectors", function () {
	var Vector = ISIS_Vector();
	var primitive = {x: 1.5, y: -2};

	describe("can be built by", function () {
		it("a primitive vector", function () {
			expect(new Vector(primitive)).toBeTruthy();
		});
	});
});
