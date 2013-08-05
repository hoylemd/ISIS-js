// test suite for utils functions
describe("isNumeric function", function () {
	var obj = {x: 2, y: 9};
	// test for positive integers
	it("returns true for positive integers", function () {
		expect(isNumeric(4)).toBeTruthy();
	});

	// test for negative integers
	it("returns true for negative integers", function () {
		expect(isNumeric(-3)).toBeTruthy();
	});

	// test for floats
	it("returns true for floats", function () {
		expect(isNumeric(0.234)).toBeTruthy();
	});

	// test for zero
	it("returns true for zero", function () {
		expect(isNumeric(0)).toBeTruthy();
	});

	// test for string
	it("returns false for strings", function () {
		expect(isNumeric("string")).toBeFalsy();
	});

	// test for object
	it("returns false for object", function () {
		expect(isNumeric(obj)).toBeFalsy();
	});

	// test for null
	it("returns false for null", function () {
		var isNull = null;
		expect(isNumeric(isNull)).toBeFalsy();
	});

	// test for undefined
	it("returns false for undefined", function () {
		expect(isNumeric(obj["thing"])).toBeFalsy();
	});
});
