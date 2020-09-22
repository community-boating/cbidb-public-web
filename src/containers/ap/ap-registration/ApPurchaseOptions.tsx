import { none, some, Option } from "fp-ts/lib/Option";
import { History } from "history";
import * as React from "react";
import * as t from 'io-ts';

import FactaButton from "../../../theme/facta/FactaButton";
import FactaNotitleRegion from "../../../theme/facta/FactaNotitleRegion";
import NavBarLogoutOnly from "../../../components/NavBarLogoutOnly";
import { setAPImage } from "../../../util/set-bg-image";
import {discountsValidator} from "../../../async/member-welcome-ap"
import Currency from "../../../util/Currency";
import assertNever from "../../../util/assertNever";
import {postWrapper as submit} from "../../../async/member/select-for-purchase"
import { makePostJSON } from "../../../core/APIWrapperUtil";
import { MAGIC_NUMBERS } from "../../../app/magicNumbers";
import {validator as pricesValidator} from "../../../async/prices"
import FactaMainPage from "../../../theme/facta/FactaMainPage";

type DiscountsProps = t.TypeOf<typeof discountsValidator>;

enum DiscountState {
	disabled = 'd',
	superceded = 's',
	available = 'a',
	eligible = 'e'
}

interface Props {
	prices: t.TypeOf<typeof pricesValidator>,
	discountsProps: DiscountsProps,
	history: History<any>
	breadcrumb: JSX.Element,
	goNext: () => Promise<void>,
	goPrev: () => Promise<void>
}

export default class ApPurchaseOptions extends React.Component<Props, { radio: string }> {
	static discountRow(id: number, title: string, price: Currency, state: DiscountState, buyButton: JSX.Element) {
		switch (state) {
		case DiscountState.disabled:
			// return (<React.Fragment>
			// 	<td><a href="#" className="readon" style={{ margin: "0 5px", backgroundColor:"#999", cursor: "default" }}><span style={{ cursor: "default"}}>Buy</span></a></td>
			// 	<td><span className="not-available"> - Not eligible.</span></td>
			// </React.Fragment>);
			return null;
		case DiscountState.superceded:
			// return (<React.Fragment>
			// 	<td><a href="#" className="readon" style={{ margin: "0 5px", backgroundColor:"#999", cursor: "default" }}><span style={{ cursor: "default"}}>Buy</span></a></td>
			// 	<td><span className="not-available"> - You are pre-approved for an equal or better discount.</span></td>
			// </React.Fragment>);
			return null;
		case DiscountState.available:
			return (<tr key={id}>
				<td style={{ textAlign: "right" }}>{title}:</td>
				<td>{price.format(true)}</td>
				<td>{buyButton}</td>
				<td><span className="not-available"> - <span style={{fontWeight: "bold", color: "red"}}>Your membership will be on hold</span> until you can verify eligibility with the Front Office.</span></td>
			</tr>);
		case DiscountState.eligible:
			return (<tr key={id}>
				<td style={{ textAlign: "right" }}>{title}:</td>
				<td>{price.format(true)}</td>
				<td>{buyButton}</td>
				<td><span className="not-available"> - You are pre-approved for this discount and do not need to verify eligibility.</span></td>
			</tr>);
		default:
			assertNever(state)
		}
	}
	assignDiscountStates() {
		const self = this;
		const discounts = [{
			id: MAGIC_NUMBERS.DISCOUNT_ID.SENIOR_DISCOUNT_ID,
			display: "Sr. Citizen (65+)",
			eligible: this.props.discountsProps.eligibleForSeniorOnline,
			available: this.props.discountsProps.seniorAvailable,
			discountAmt: this.props.discountsProps.seniorDiscountAmt
		}, {
			id: MAGIC_NUMBERS.DISCOUNT_ID.YOUTH_DISCOUNT_ID,
			display: "Young Adult (18-20)",
			eligible: this.props.discountsProps.eligibleForYouthOnline,
			available: this.props.discountsProps.youthAvailable,
			discountAmt: this.props.discountsProps.youthDiscountAmt
		}, {
			id: MAGIC_NUMBERS.DISCOUNT_ID.STUDENT_DISCOUNT_ID,
			display: "Student",
			eligible: this.props.discountsProps.eligibleForStudent,
			available: true,
			discountAmt: this.props.discountsProps.studentDiscountAmt
		}, {
			id: MAGIC_NUMBERS.DISCOUNT_ID.VETERAN_DISCOUNT_ID,
			display: "Veteran/First Responder",
			eligible: this.props.discountsProps.eligibleForVeteranOnline,
			available: true,
			discountAmt: this.props.discountsProps.veteranDiscountAmt
		}, {
			id: MAGIC_NUMBERS.DISCOUNT_ID.MGH_DISCOUNT_ID,
			display: "MGH/Partners Employee",
			eligible: this.props.discountsProps.eligibleForMGH,
			available: true,
			discountAmt: this.props.discountsProps.mghDiscountAmt
		}];

		// biggest discoutns first
		discounts.sort((a,b) => b.discountAmt - a.discountAmt)

		// Biggest discount amount we are eligible for
		const highestEligibleAmount = discounts.reduce((best, d) => {
			if (d.eligible && d.discountAmt > best) return d.discountAmt;
			else return best;
		}, 0);

		return discounts.map(d => {
			// Is this discount less than a discount that we would be auto granted by cc_pkg.assess_discounts()
			// If it is, don't even offer it becuase the back end will just stomp on it with the better discount anyway
			const discountIsInferior = d.discountAmt < highestEligibleAmount;
			const state = (function() {
				if (d.eligible) {
					if (discountIsInferior) {
						return DiscountState.superceded;
					} else {
						return DiscountState.eligible;
					}
				} else if (d.available) {
					if (discountIsInferior) {
						return DiscountState.superceded;
					} else {
						return DiscountState.available;
					}
				} else {
					return DiscountState.disabled;
				}
			}());

			return {
				...d,
				state,
				rowElement: ApPurchaseOptions.discountRow(
					d.id,
					d.display,
					Currency.dollars(this.props.discountsProps.fyBasePrice - d.discountAmt),
					state,
					self.makeBuyButton(MAGIC_NUMBERS.MEMBERSHIP_TYPE_ID.FULL_YEAR, some(d.id))
				)
			}
		});
	}
	makeBuyButton(memTypeId: number, requestedDiscountId: Option<number>) {
		const self = this;
		return (<FactaButton text="Buy" onClick={() => {
			return submit.send(makePostJSON({
				memTypeId: memTypeId,
				requestedDiscountId
			})).then(res => {
				if (res.type == "Success") {
					self.props.goNext()
				} else {
					window.scrollTo(0, 0);
					// self.setState({
					// 	...self.state,
					// 	validationErrors: res.message.split("\\n") // TODO
					// });
				}
			})
		}}/>)
	}
	findMembershipPrice(membershipTypeId: number): Currency {
		return Currency.dollars(this.props.prices.memberships.find(m => m.membershipId == membershipTypeId).membershipBasePrice);
	}
	render() {
		const self = this;
		console.log(this.props.discountsProps)
		const discountsWithStates = this.assignDiscountStates();
		console.log(discountsWithStates)
		const fyHeader = (
			this.props.discountsProps.canRenew
			? `Full Year Membership Renewal: ${Currency.dollars(this.props.discountsProps.fyBasePrice - this.props.discountsProps.renewalDiscountAmt).format(true)}`
			: `Full Year Membership: ${Currency.dollars(this.props.discountsProps.fyBasePrice).format(true)}`
		)
		return <FactaMainPage setBGImage={setAPImage} navBar={NavBarLogoutOnly({ history: this.props.history, sysdate: none, showProgramLink: false })}>
			<FactaNotitleRegion>
				{this.props.breadcrumb}
			</FactaNotitleRegion>
			<FactaNotitleRegion>
				<React.Fragment>
					<style>
						{`
							.available, .available a{
							font-weight:normal;
							}

							.not-available{
							font-weight:normal;
							font-style: italic;
							font-size: 0.9em;
							}
						`}
					</style>

					<a href="http://www.community-boating.org/programs/adult-program/membership-prices/" target="_blank">Click here to learn about the different membership types and discounts that we offer.</a>
					<br /><br />


					<table><tbody><tr><td>
						{self.makeBuyButton(MAGIC_NUMBERS.MEMBERSHIP_TYPE_ID.FULL_YEAR, none)}
					</td><td>
							<h2 style={{ visibility: "visible", fontSize: "1.7em" }}>{fyHeader}</h2>
						</td></tr></tbody></table>
					<span style={{fontWeight: "bold"}}>Available Discounts:</span>
					<br />
					<table style={{ fontWeight: "bold", marginTop: "10px" }}>
						<tbody>
							{discountsWithStates.map(d => d.rowElement)}
						</tbody></table>
					<br /><br />
					<p>Includes:</p>
					<ul>
						<li>Access to all boats</li>
						<li>Basic and Intermediate classes</li>
						<li>Advanced classes for a nominal fee of $35</li>
						<li>Discounts to CBI events</li>
						<li>Guest privileges (with appropriate rating)</li>
					</ul><br />



					<table><tbody><tr><td>
						{self.makeBuyButton(MAGIC_NUMBERS.MEMBERSHIP_TYPE_ID.MEM_60_DAY, none)}
					</td><td>
						<h2 id="h0-2-60-day-boating-pass-209" style={{ visibility: "visible", fontSize: "1.7em" }}>
							60 Day Membership: {this.findMembershipPrice(MAGIC_NUMBERS.MEMBERSHIP_TYPE_ID.MEM_60_DAY).format(true)}
						</h2>
						</td></tr></tbody></table>
					<p>Includes:</p>
					<ul>
						<li>Access to all boat usage, classes and instruction</li>
						<li>Able to earn all ratings</li>
						<li>Advanced classes for a nominal fee of $35</li>
						<li>Guest privileges can be purchased for {Currency.dollars(this.props.prices.guestPrivsPrice).format(true)}</li>
					</ul><br />

					<table><tbody><tr><td>
						{self.makeBuyButton(MAGIC_NUMBERS.MEMBERSHIP_TYPE_ID.MEM_30_DAY, none)}
					</td><td>
						<h2 id="h0-2-30-day-boating-pass-209" style={{ visibility: "visible", fontSize: "1.7em" }}>
							30 Day Membership: {this.findMembershipPrice(MAGIC_NUMBERS.MEMBERSHIP_TYPE_ID.MEM_30_DAY).format(true)}
						</h2>
						</td></tr></tbody></table>
					<p>Includes:</p>
					<ul>
						<li>Access to all boat usage, classes and instruction</li>
						<li>Able to earn all ratings</li>
						<li>Advanced classes for a nominal fee of $35</li>
						<li>Guest privileges can be purchased for {Currency.dollars(this.props.prices.guestPrivsPrice).format(true)}</li>
					</ul><br />


					<table><tbody><tr><td>
						{self.makeBuyButton(MAGIC_NUMBERS.MEMBERSHIP_TYPE_ID.MEM_30_DAY_WICKED_BASIC, none)}
					</td><td>
							<h2 id="h0-3-30-day-intro-to-sailing-99" style={{ visibility: "visible", fontSize: "1.7em" }}>
								30 Day Wicked Basic, No Frills, Sailing Pass: {this.findMembershipPrice(MAGIC_NUMBERS.MEMBERSHIP_TYPE_ID.MEM_30_DAY_WICKED_BASIC).format(true)}
							</h2>
						</td></tr></tbody></table>
					<p>Includes:</p>
					<ul>
						<li>Usage of Mercury sailboats, beginner Mercury classes, and instruction</li>
						<li>Mercury Green rating only</li>
						<li>Not eligible for Advanced classes, Windsurfing, Kayaking, Paddleboarding, or Guest Privileges</li>
					</ul><br />

					<table><tbody><tr><td>
						{self.makeBuyButton(MAGIC_NUMBERS.MEMBERSHIP_TYPE_ID.FULL_YEAR_PADDLING, none)}
					</td><td>
							<h2 id="h0-3-FY-paddling" style={{ visibility: "visible", fontSize: "1.7em" }}>
								Full Year Paddling Pass: {this.findMembershipPrice(MAGIC_NUMBERS.MEMBERSHIP_TYPE_ID.FULL_YEAR_PADDLING).format(true)}
							</h2>
						</td></tr></tbody></table>
					<p>Includes:</p>
					<ul>
						<li>Access to our Sit on Top Kayaks and Stand Up Paddleboards</li>
						<li>Guest privileges can be purchased for {Currency.dollars(this.props.prices.guestPrivsPrice).format(true)}, which covers 1 guest each time on the same double kayak as the member</li>
						<li>Our member's guest discount (half off the day rental rate) is available for 1 Kayak or SUP</li>
					</ul><br />
				</React.Fragment>
			</FactaNotitleRegion>
			<FactaButton text="< Back" onClick={self.props.goPrev} />
			{(self.state || {} as any).radio != undefined ? <FactaButton text="Next >" spinnerOnClick onClick={() =>
				self.props.goNext()
			} /> : ""}
		</FactaMainPage>
	}
}