export class DoublyLinkedList<T> {
	left: T[]
	curr: T
	right: T[]
	constructor(left: T[], curr: T,  right: T[]) {
		this.left = left
		this.curr = curr
		this.right = right
	}
	static from<T>(es: T[]): DoublyLinkedList<T> {
		return new DoublyLinkedList([], es[0], es.slice(1))
	}
	next(): DoublyLinkedList<T> {
		if (this.right.length == 0) return this;
		else return new DoublyLinkedList(this.left.concat(this.curr), this.right[0], this.right.slice(1))
	}
	prev(): DoublyLinkedList<T> {
		if (this.left.length == 0) return this;
		else return new DoublyLinkedList(this.left.slice(0, this.left.length-1), this.left[this.left.length-1], [this.curr].concat(this.right))
	}
	nextMany(spaces: number): DoublyLinkedList<T> {
		if (spaces == 0 || this.right.length < spaces) return this;
		else {
			const left = this.left.concat([this.curr]).concat(this.right.slice(0, spaces-1))
			const curr = this.right[spaces-1];
			const right = this.right.slice(spaces);
			return new DoublyLinkedList(left, curr, right);
		}
	}
	prevMany(spaces: number): DoublyLinkedList<T> {
		if (spaces == 0 || this.left.length < spaces) return this;
		else {
			const left = this.left.slice(0, this.left.length - spaces);
			const curr = this.left[this.left.length - spaces];
			const leftRemaining = this.left.length > 1 ? this.left.slice((this.left.length - spaces)+1) : [];
			const right = leftRemaining.concat([this.curr]).concat(this.right);
			return new DoublyLinkedList(left, curr, right);
		}
	}
	hasNext(): boolean {
		return this.right.length > 0
	}
	hasPrev(): boolean {
		return this.left.length > 0
	}
	home(): DoublyLinkedList<T> {
		return new DoublyLinkedList([], this.left[0], this.left.slice(1).concat([this.curr]).concat(this.right))
	}
}