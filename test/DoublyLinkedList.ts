import * as assert from "assert"
import { DoublyLinkedList } from "../src/util/DoublyLinkedList";

const nodes = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m"];

describe("Doubly Linked List", function() {
	it("should move right", () => {
		const start = DoublyLinkedList.from(nodes);
		const end = start.next().next().next();
		assert.equal(end.curr, "d");
	});
	it("should move right then left", () => {
		const start = DoublyLinkedList.from(nodes);
		const end = start
			.next().next().next().next().next().next()
			.prev().prev();
		assert.equal(end.curr, "e");
	});
	it("should moveMany right", function() {
		const start = DoublyLinkedList.from(nodes);
		const end = start.nextMany(4);
		assert.equal(end.curr, "e");
	});
	it("should moveMany right then left", function() {
		const start = DoublyLinkedList.from(nodes);
		const int = start.nextMany(7);
		const end = int.prevMany(2);
		assert.equal(end.curr, "f");
	});
	it("should do nothing on nextMany(0)", function() {
		const start = DoublyLinkedList.from(nodes);
		const int = start.nextMany(5);
		const end = int.nextMany(0);
		assert.equal(end.curr, int.curr)
	});
	it("should do nothing on prevMany(0)", function() {
		const start = DoublyLinkedList.from(nodes);
		const int = start.nextMany(5);
		const end = int.prevMany(0);
		assert.equal(end.curr, int.curr)
	});
	it("should nextMany and still have same # elements", function() {
		const start = DoublyLinkedList.from(nodes);
		const int = start.nextMany(5);
		assert.equal(start.left.length + start.right.length, int.left.length + int.right.length)
	});
	it("should prevMany and still have same # elements", function() {
		const start = DoublyLinkedList.from(nodes);
		const int = start.nextMany(7).prevMany(3);
		assert.equal(start.left.length + start.right.length, int.left.length + int.right.length)
	});
	it("should nextMany all the way to the end, and prevMany all the way back", function() {
		const start = DoublyLinkedList.from(nodes);
		const int = start.nextMany(nodes.length-1);
		const end = int.prevMany(nodes.length-1);
		assert.deepEqual(start, end)
	});
	it("should nextMany by 1 all the way to the end, and prevMany by 1 all the way back", function() {
		const start = DoublyLinkedList.from(nodes);
		const int = start.nextMany(1).nextMany(1).nextMany(1).nextMany(1).nextMany(1).nextMany(1).nextMany(1).nextMany(1).nextMany(1).nextMany(1).nextMany(1).nextMany(1);
		const end = int.prevMany(1).prevMany(1).prevMany(1).prevMany(1).prevMany(1).prevMany(1).prevMany(1).prevMany(1).prevMany(1).prevMany(1).prevMany(1).prevMany(1);
		assert.deepEqual(start, end)
	});
})