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
import { apClassesPageRoute } from '../../app/routes/ap/classes';
import { apPathAddons } from '../../app/paths/ap/addons';
import { apDonateRoute } from '../../app/routes/ap/donate';

function testBit(num: number, bit: number) {
	return ((num >> bit) % 2 != 0)
}

const abortText = (text: string) => (history: History<any>) => <a href="#" onClick={e => {
	e.preventDefault();
	if (window.confirm(`Do you really want to abort ${text} registration?`)) {
		abortRegistration.send(makePostJSON({})).then(() => history.push("/redirect" + apBasePath.getPathFromArgs({})))
	}
}}>{`Cancel ${text} Purchase`}</a>;

const LINKS = {
	regLink: (text: React.ReactNode) => (history: History<any>) => <Link to={apRegPageRoute.getPathFromArgs({})}>{text}</Link>,
	abortText,
	abort: abortText("Membership"),
	classes: (history: History<any>) => <Link to={apClassesPageRoute.getPathFromArgs({})}>Signup for Classes</Link>,
	edit: (history: History<any>) => <Link to={apEditPageRoute.getPathFromArgs({})}>Edit Information</Link>,
	kayakOrSUPRental: (history: History<any>) => <a href="https://fareharbor.com/embeds/book/communityboating/?sheet=275108&full-items=yes&flow=411419" target="_blank">Reserve a Kayak/SUP *</a>,
}

export const getNoGP = (bv: number) => testBit(bv, 16);
export const getNoDW = (bv: number) => testBit(bv, 17);
export const getAddonsPurchaseInProgress = (bv: number) => testBit(bv, 28);

export default (bv: number, personId: number, history: History<any>, discountAmt: Currency, expirationDate: Option<Moment>, show4th: boolean) => {
	// const canRenew = testBit(bv, 4) || testBit(bv, 7);

	const renewText = () => (<React.Fragment>
		Renew for a year
		<br />
		({discountAmt.format()} discount until {expirationDate.getOrElse(null).clone().add(7, 'days').format("MM/DD/YYYY")})
		</React.Fragment>);

	const showSignupLink = (place: number) => {
	//	const discountFrozen = testBit(bv, 26);
		const adminHold = testBit(bv, 27);
		return () => !adminHold && testBit(bv, place);
	}

	const noGP = getNoGP(bv);
	const noDW = getNoDW(bv);

	const actions: {
		place?: number, getElements: ((history: History<any>) => JSX.Element)[], show?: () => boolean
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
		place: 28,
		getElements: [
			LINKS.abortText("Addons")
		]
	}, {
		place: 3,
		getElements: [
			LINKS.classes
		]
	}, {
		show: showSignupLink(14),
		getElements: [
			LINKS.kayakOrSUPRental
		] 
	}, {
		show: showSignupLink(15),
		getElements: [
			LINKS.kayakOrSUPRental
		] 
	}, {
		show: showSignupLink(18),
		getElements: [
			(history: History<any>) => <React.Fragment>
				<a target="_blank" href="https://fareharbor.com/embeds/book/communityboating/items/245032/?full-items=yes">Sign up for your Rigging Test</a>
				<br />
				<span style={{color: "#555", fontSize: "0.9em", fontStyle:"italic"}}>Please review the Rigging class resources in our Virtual Learning Center<br />(<a style={{fontSize: "0.9em"}} target="_blank" href="https://www.community-boating.org/elearning">www.community-boating.org/elearning</a>).</span>
			</React.Fragment>
		] 
	}, {
		show: showSignupLink(25),
		getElements: [
			(history: History<any>) => <a href="https://fareharbor.com/embeds/book/communityboating/?full-items=yes&flow=437192" target="_blank">Reserve a Keel Mercury *</a>
		] 
	}, {
		show: showSignupLink(24),
		getElements: [
			(history: History<any>) => <a href="https://fareharbor.com/embeds/book/communityboating/?full-items=yes&flow=431635" target="_blank">Reserve a Keel Mercury *</a>
		] 
	}, {
		show: showSignupLink(20),
		getElements: [
			(history: History<any>) => <a target="_blank" href="https://fareharbor.com/embeds/book/communityboating/?full-items=yes&flow=431544">Reserve a Laser *</a>
				
		] 
	}, {
		show: showSignupLink(21),
		getElements: [
			(history: History<any>) => <a target="_blank" href="https://fareharbor.com/embeds/book/communityboating/?full-items=yes&flow=431540">Reserve a Sonar *</a>
				
		] 
	}, {
		show: showSignupLink(22),
		getElements: [
			(history: History<any>) => <a target="_blank" href="https://fareharbor.com/embeds/book/communityboating/?full-items=yes&flow=431542">Reserve an Ideal 18 *</a>
				
		] 
	}, {
		show: showSignupLink(23),
		getElements: [
			(history: History<any>) => <a target="_blank" href="https://fareharbor.com/embeds/book/communityboating/?full-items=yes&flow=431633">Reserve a 420 *</a>
				
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
		show: () => noGP || noDW,
		getElements: [
			() => {
				const text = (
					noDW
					? (
						noGP
						? <React.Fragment>Purchase Guest Privileges<br />and/or Damage Waiver</React.Fragment>
						: "Purchase Damage Waiver"
					)
					: "Purchase Guest Privileges"
				);

				return <Link to={apPathAddons.getPathFromArgs({})}>{text}</Link>;
			}
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
		]
	}, {
		show: () => testBit(bv, 7) || testBit(bv, 8),
		getElements: [
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
		show: () => testBit(bv, 13) || (testBit(bv, 30) && !testBit(bv, 3)),
		getElements: [
			LINKS.edit
		]
	}, {
		place: 29,
		getElements: [
			(history: History<any>) => <Link to={apDonateRoute.getPathFromArgs({})}>Create/Manage Recurring Donations</Link>
		]
	}, {
		place: 30,
		getElements: [
			(history: History<any>) => <Link to={apDonateRoute.getPathFromArgs({})}>View Payment Plan</Link>
		]
	}];

	const showReserveFooter = (
		testBit(bv, 14) || 
		testBit(bv, 15) || 
		testBit(bv, 19) || 
		testBit(bv, 20)
	);

	const footer = <React.Fragment>
		<br />
		<span style={{color: "#555", fontSize: "0.9em", fontStyle:"italic"}}>* Reservations must be made in advance;<br />we cannot accommodate walkups.</span><br />
		<span style={{color: "#555", fontSize: "0.9em", fontStyle:"italic"}}>  Please book only one sailing appointment<br />per weekend (Satuday - Sunday)</span>
	</React.Fragment>;

	return (<React.Fragment>
		<ul style={{fontSize: "0.8em"}}>
			{actions
				.filter(({ place, show }) => {
					// if it has both `place` and `show`, both must pass
					if (place != undefined && show != undefined) {
						return testBit(bv, place) && show();
					} else {
						return (place != undefined && testBit(bv, place)) || (show && show());
					}
				})
				.flatMap(({ getElements }) => getElements.map(e => e(history)))
				.filter(Boolean)
				.map((element, i) => <li key={i}>{element}</li>)
			}
		</ul>
		{showReserveFooter ? footer : null}
	</React.Fragment>);
}
