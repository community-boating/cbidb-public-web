import * as React from 'react'
import { History } from 'history';
import {apRegPageRoute} from "../../app/routes/ap/reg"
import { Link } from 'react-router-dom';
import Currency from '../../util/Currency';
import { Option } from 'fp-ts/lib/Option';
import { Moment } from 'moment';
import { makePostJSON } from '../../core/APIWrapperUtil';
import {postWrapper as abortRegistration} from "../../async/member/abort-mem-reg"
import { apBasePath } from '../../app/paths/ap/_base';
//import { apClassesPageRoute } from '../../app/routes/ap/classes';
import { apEditPageRoute } from '../../app/routes/ap/edit';

function testBit(num: number, bit: number) {
	return ((num >> bit) % 2 != 0)
}

const LINKS = {
	regLink: (text: React.ReactNode) => (history: History<any>) => <Link to={apRegPageRoute.getPathFromArgs({})}>{text}</Link>,
	abort: (history: History<any>) => <a href="#" onClick={e => {
		e.preventDefault();
		if (window.confirm(`Do you really want to abort membership registration?`)) {
			abortRegistration.send(makePostJSON({})).then(() => history.push("/redirect" + apBasePath.getPathFromArgs({})))
		}
	}}>{"Cancel Membership Purchase"}</a>,
	classes: (history: History<any>) => null as any, // <Link to={apClassesPageRoute.getPathFromArgs({})}>Signup for Classes</Link>,
	edit: (history: History<any>) => <Link to={apEditPageRoute.getPathFromArgs({})}>Edit Information</Link>,
	keelMercRental: (history: History<any>) => (<React.Fragment>
		<a href="https://fareharbor.com/embeds/book/communityboating/items/240416/?full-items=yes&flow=no" target="_blank">Reserve a Keel Mercury</a>
		<br />
		<span style={{color: "#555", fontSize: "0.9em", fontStyle:"italic"}}>(Reservations must be made in advance; we cannot accommodate walkups)</span>
	</React.Fragment>),
	kayakOrSUPRental: (history: History<any>) => (<React.Fragment>
		<a href="https://fareharbor.com/embeds/book/communityboating/?sheet=275108&full-items=yes&flow=411419" target="_blank">Reserve a Kayak/SUP</a>
		<br />
		<span style={{color: "#555", fontSize: "0.9em", fontStyle:"italic"}}>(Reservations must be made in advance; we cannot accommodate walkups)</span>
	</React.Fragment>),
}

export default (bv: number, personId: number, history: History<any>, discountAmt: Currency, expirationDate: Option<Moment>, show4th: boolean) => {
	const renewText = () => (<React.Fragment>
		Renew for a year
		<br />
		({discountAmt.format()} discount until {expirationDate.getOrElse(null).clone().add(7, 'days').format("MM/DD/YYYY")})
		</React.Fragment>);

	const actions: {
		place: number, getElements: ((history: History<any>) => JSX.Element)[]
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
		place: 14,
		getElements: [
			LINKS.keelMercRental,
			LINKS.kayakOrSUPRental
		] 
	}, {
		place: 15,
		getElements: [
			LINKS.keelMercRental,
			LINKS.kayakOrSUPRental
		] 
	}, {
		place: 18,
		getElements: [
			(history: History<any>) => <React.Fragment>
				<a target="_blank" href="https://fareharbor.com/embeds/book/communityboating/items/245032/?full-items=yes">Sign up for your Rigging Test</a>
				<br />
				<span style={{color: "#555", fontSize: "0.9em", fontStyle:"italic"}}>Please review the Rigging class resources in our Virtual Learning Center<br />(<a style={{fontSize: "0.9em"}} target="_blank" href="https://www.community-boating.org/elearning">www.community-boating.org/elearning</a>).</span>
			</React.Fragment>
		] 
	}, {
		place: 19,
		getElements: [
			LINKS.keelMercRental,
		] 
	}, {
		place: 20,
		getElements: [
			(history: History<any>) => <React.Fragment>
				<a target="_blank" href="https://fareharbor.com/embeds/book/communityboating/items/244905/?full-items=yes">Reserve a Laser</a>
				<br />
				<span style={{color: "#555", fontSize: "0.9em", fontStyle:"italic"}}>(Reservations must be made in advance; we cannot accommodate walkups)</span>
			</React.Fragment>
				
		] 
	}, {
		place: 4,
		getElements: [
			(history: History<any>) => LINKS.regLink(renewText())(history)
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
			(history: History<any>) => LINKS.regLink(renewText())(history)
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
		.flatMap(({ getElements }) => getElements.map(e => e(history)))
		.filter(Boolean)
		.map((element, i) => <li key={i}>{element}</li>)
}