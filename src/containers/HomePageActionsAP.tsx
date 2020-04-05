import * as React from 'react'
import { History } from 'history';
import PlaceholderLink from '../components/PlaceholderLink';


function testBit(num: number, bit: number) {
	return ((num >> bit) % 2 != 0)
}

const LINKS = {
	regLink: (text: string) => <PlaceholderLink>{text}</PlaceholderLink>,
	abort: () => <PlaceholderLink>Abort Registration</PlaceholderLink>,
	classes: () => <PlaceholderLink>Signup for Classes</PlaceholderLink>,
	edit: () => <PlaceholderLink>Edit Information</PlaceholderLink>,
}

export default (bv: number, juniorId: number, history: History<any>) => {
	const actions = [{
		place: 0,
		elements: [
			LINKS.regLink("Purchase an Adult Program membership!")
		]
	}, {
		place: 1,
		elements: [
			LINKS.regLink("Continue Registration"),
			LINKS.abort()
		]
	}, {
		place: 2,
		elements: [
			LINKS.regLink("Edit Registration"),
			LINKS.abort()
		]
	}, {
		place: 3,
		elements: [
			LINKS.classes()
		]
	}, {
		place: 4,
		elements: [<PlaceholderLink>renew</PlaceholderLink>] //TODO: Inject renewal price and grace period end
	}, {
		place: 5,
		elements: [
			LINKS.regLink("Extend your membership")
		]
	}, {
		place: 6,
		elements: [
			LINKS.edit(),
			<PlaceholderLink>4th </PlaceholderLink> // TODO: 4th links, dock party etc
		]
	}, {
		place: 7,
		elements: [<PlaceholderLink>renew</PlaceholderLink>] //TODO: Inject renewal price and grace period end
	}, {
		place: 8,
		elements: [
			LINKS.regLink("Purchase Membership"),
			LINKS.edit()
		]
	}, {
		place: 9,
		elements: [
			LINKS.classes()
		]
	}, {
		place: 10,
		elements: [
			LINKS.regLink("Continue Registration"),
			LINKS.abort()
		]
	}, {
		place: 11,
		elements: [
			LINKS.classes()
		]
	}, {
		place: 12,
		elements: [
			LINKS.regLink("Edit Registration"),
			LINKS.abort()
		]
	}, {
		place: 13,
		elements: [
			LINKS.edit()
		]
	}]

	return actions
		.filter(({ place }) => testBit(bv, place))
		.flatMap(({ elements }) => elements)
		.map((element, i) => <li key={i}>{element}</li>)
}