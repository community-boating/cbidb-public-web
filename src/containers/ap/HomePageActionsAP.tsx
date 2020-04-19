import * as React from 'react'
import { History } from 'history';
import PlaceholderLink from '../../components/PlaceholderLink';
import {apRegPageRoute} from "../../app/routes/ap/reg"
import { Link } from 'react-router-dom';
import Currency from '../../util/Currency';
import { Option } from 'fp-ts/lib/Option';
import { Moment } from 'moment';

function testBit(num: number, bit: number) {
	return ((num >> bit) % 2 != 0)
}

const LINKS = {
	regLink: (text: React.ReactNode) => <Link to={apRegPageRoute.getPathFromArgs({})}>{text}</Link>,
	abort: () => <PlaceholderLink>Abort Registration</PlaceholderLink>,
	classes: () => <PlaceholderLink>Signup for Classes</PlaceholderLink>,
	edit: () => <PlaceholderLink>Edit Information</PlaceholderLink>,
}

export default (bv: number, personId: number, history: History<any>, discountAmt: Currency, expirationDate: Option<Moment>, show4th: boolean) => {
	const renewText = () => (<React.Fragment>
		Renew for a year
		<br />
		({discountAmt.format()} discount until {expirationDate.getOrElse(null).clone().add(7, 'days').format("MM/DD/YYYY")})
		</React.Fragment>);

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
			LINKS.regLink(renewText())
		] 
	}, {
		place: 5,
		elements: [
			LINKS.regLink("Extend your membership")
		]
	}, {
		// Dock party etc links here
		place: 6,
		elements: [
			LINKS.edit(),
			(show4th ? <a target="_blank" href={`https://sailabration-${personId}.eventbrite.com/?discount=FYAdult`}>Buy 4th of July Tickets</a> : null)
		]
	}, {
		place: 7,
		elements: [
			LINKS.regLink(renewText())
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
		.filter(Boolean)
		.map((element, i) => <li key={i}>{element}</li>)
}