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
	regLink: (text: React.ReactNode) => () => <Link to={apRegPageRoute.getPathFromArgs({})}>{text}</Link>,
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

	const actions: {
		place: number, getElements: (() => JSX.Element)[]
	}[] = [{
		place: 0,
		getElements: [
			LINKS.regLink("Purchase an Adult Program membership!")
		]
	}, {
		place: 1,
		getElements: [
			LINKS.regLink("Continue Registration"),
			LINKS.abort
		]
	}, {
		place: 2,
		getElements: [
			LINKS.regLink("Edit Registration"),
			LINKS.abort
		]
	}, {
		place: 3,
		getElements: [
			LINKS.classes
		]
	}, {
		place: 4,
		getElements: [
			() => LINKS.regLink(renewText())()
		] 
	}, {
		place: 5,
		getElements: [
			LINKS.regLink("Extend your membership")
		]
	}, {
		// Dock party etc links here
		place: 6,
		getElements: [
			LINKS.edit,
			() => (show4th ? <a target="_blank" href={`https://sailabration-${personId}.eventbrite.com/?discount=FYAdult`}>Buy 4th of July Tickets</a> : null)
		]
	}, {
		place: 7,
		getElements: [
			() => LINKS.regLink(renewText())()
		]
	}, {
		place: 8,
		getElements: [
			LINKS.regLink("Purchase Membership"),
			LINKS.edit
		]
	}, {
		place: 9,
		getElements: [
			LINKS.classes
		]
	}, {
		place: 10,
		getElements: [
			LINKS.regLink("Continue Registration"),
			LINKS.abort
		]
	}, {
		place: 11,
		getElements: [
			LINKS.classes
		]
	}, {
		place: 12,
		getElements: [
			LINKS.regLink("Edit Registration"),
			LINKS.abort
		]
	}, {
		place: 13,
		getElements: [
			LINKS.edit
		]
	}]

	return actions
		.filter(({ place }) => testBit(bv, place))
		.flatMap(({ getElements }) => getElements.map(e => e()))
		.filter(Boolean)
		.map((element, i) => <li key={i}>{element}</li>)
}