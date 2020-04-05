import * as React from 'react'
import { History } from 'history';
import PlaceholderLink from '../../components/PlaceholderLink';
import {apRegPageRoute} from "../../app/routes/ap/reg"
import { Link } from 'react-router-dom';

function testBit(num: number, bit: number) {
	return ((num >> bit) % 2 != 0)
}

const LINKS = {
	regLink: (text: string) => <Link to={apRegPageRoute.getPathFromArgs({})}>{text}</Link>,
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
		elements: [
			LINKS.regLink("renew"),//TODO: Inject renewal price and grace period end
			<PlaceholderLink>renew</PlaceholderLink>
		] 
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
		elements: [
			LINKS.regLink("renew"),//TODO: Inject renewal price and grace period end
			<PlaceholderLink>renew</PlaceholderLink>
		]
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