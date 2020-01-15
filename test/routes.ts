import * as assert from "assert"
import PathSegment from "../src/core/PathSegment"

const jp = new PathSegment("/jp")
const ratings = jp.appendPathSegment<{personId: string}>("/ratings/:personId")

describe("PathSegment", function() {
	it("concatenates path on append", function() {
        assert.equal(ratings.path, '/jp/ratings/:personId');
    })

    it("extracts params", function() {
        const expected = {personId: "123"}
        assert.deepEqual(expected, ratings.extractURLParams("/jp/ratings/123"))
    })

    it("stacks params", function() {
        const nestedPath = ratings.appendPathSegment<{secondParam: string, thirdParam: string}>("/thing/:secondParam/:thirdParam");
        const expected = {personId: "123", secondParam: "aaa", thirdParam: "bbb"};
        assert.deepEqual(expected, nestedPath.extractURLParams("/jp/ratings/123/thing/aaa/bbb"))
    })
})