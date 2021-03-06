import * as assert from "assert"
import PathWrapper from "../src/core/PathWrapper"

const jp = new PathWrapper("jp")
const ratings = jp.appendPathSegment<{ personId: string }>("ratings/:personId/")

describe("PathWrapper", function (){
	it("concatenates path on append", function () {
		assert.equal(ratings.path, '/jp/ratings/:personId');
	})

	it("extracts params", function() {
		const expected = { personId: "123" }
		assert.deepEqual(ratings.extractURLParams("/jp/ratings/123"), expected)
	})

	it("stacks params", function() {
		const nestedPath = ratings.appendPathSegment<{ secondParam: string, thirdParam: string }>("/thing/:secondParam/:thirdParam");
		const expected = { personId: "123", secondParam: "aaa", thirdParam: "bbb" };
		assert.deepEqual(nestedPath.extractURLParams("/jp/ratings/123/thing/aaa/bbb"), expected)
	})

	it("binds args", function() {
		const args = { personId: "123" };
		const expected = '/jp/ratings/123';
		assert.equal(ratings.getPathFromArgs(args), expected)
	})

	it("binds multiple args", function() {
		const nestedPath = ratings.appendPathSegment<{ secondParam: string, thirdParam: string }>("/thing/:secondParam/:thirdParam");
		const args = { personId: "123", secondParam: "aaa", thirdParam: "bbb" };
		const expected = "/jp/ratings/123/thing/aaa/bbb";
		assert.equal(nestedPath.getPathFromArgs(args), expected)
	})
})