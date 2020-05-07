import { none, some, Option } from "fp-ts/lib/Option";
import { History } from "history";
import * as React from "react";
import * as t from 'io-ts';

import Button from "../../../components/Button";
import JoomlaMainPage from "../../../theme/joomla/JoomlaMainPage";
import JoomlaNotitleRegion from "../../../theme/joomla/JoomlaNotitleRegion";
import NavBarLogoutOnly from "../../../components/NavBarLogoutOnly";
import { setAPImage } from "../../../util/set-bg-image";
import {discountsValidator} from "../../../async/member-welcome-ap"
import Currency from "../../../util/Currency";
import assertNever from "../../../util/assertNever";
import {postWrapper as submit} from "../../../async/member/select-for-purchase"
import { makePostJSON } from "../../../core/APIWrapperUtil";
import { MAGIC_NUMBERS } from "../../../app/magicNumbers";

type DiscountsProps = t.TypeOf<typeof discountsValidator>;

enum DiscountState {
	disabled,
	superceded,
	available,
	eligible
}

interface Props {
	discountsProps: DiscountsProps,
	history: History<any>
	breadcrumb: JSX.Element,
	goNext: () => Promise<void>,
	goPrev: () => Promise<void>
}

export default class ApPurchaseOptions extends React.Component<Props, { radio: string }> {
	static discountRow(title: string, price: Currency, state: DiscountState, buyButton: JSX.Element) {
		const self = this;
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
			return (<tr>
				<td style={{ textAlign: "right" }}>{title}:</td>
				<td>{price.format(true)}</td>
				<td>{buyButton}</td>
				<td><span className="not-available"> - <span style={{fontWeight: "bold", color: "red"}}>Your membership will be on hold</span> until you can verify eligibility with the Front Office.</span></td>
			</tr>);
		case DiscountState.eligible:
			return (<tr>
				<td style={{ textAlign: "right" }}>{title}:</td>
				<td>{price.format(true)}</td>
				<td>{buyButton}</td>
				<td><span className="not-available"> - You are pre-approved for this discount and do not need to verify eligibility.</span></td>
			</tr>);
		default:
			assertNever(state)
		}
	}
	makeBuyButton(memTypeId: number, requestedDiscountId: Option<number>) {
		const self = this;
		return (<Button text="Buy" onClick={() => {
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
	render() {
		const self = this;
		console.log(this.props.discountsProps)
		const fyHeader = (
			this.props.discountsProps.canRenew
			? `Full Year Membership Renewal: ${Currency.dollars(this.props.discountsProps.fyBasePrice - this.props.discountsProps.renewalDiscountAmt).format(true)}`
			: `Full Year Membership: ${Currency.dollars(this.props.discountsProps.fyBasePrice).format(true)}`
		)
		return <JoomlaMainPage setBGImage={setAPImage} navBar={NavBarLogoutOnly({ history: this.props.history, sysdate: none, showProgramLink: false })}>
			<JoomlaNotitleRegion>
				{this.props.breadcrumb}
			</JoomlaNotitleRegion>
			<JoomlaNotitleRegion>
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
							{ApPurchaseOptions.discountRow(
								"Young Adult (18-20)",
								Currency.dollars(this.props.discountsProps.fyBasePrice - this.props.discountsProps.youthDiscountAmt),
								DiscountState.superceded,
								self.makeBuyButton(MAGIC_NUMBERS.MEMBERSHIP_TYPE_ID.FULL_YEAR, some(MAGIC_NUMBERS.DISCOUNT_ID.YOUTH_DISCOUNT_ID))
							)}
							{ApPurchaseOptions.discountRow(
								"Sr. Citizen (65+)",
								Currency.dollars(this.props.discountsProps.fyBasePrice - this.props.discountsProps.seniorDiscountAmt),
								DiscountState.disabled,
								self.makeBuyButton(MAGIC_NUMBERS.MEMBERSHIP_TYPE_ID.FULL_YEAR, some(MAGIC_NUMBERS.DISCOUNT_ID.SENIOR_DISCOUNT_ID))
							)}
							{ApPurchaseOptions.discountRow(
								"Student",
								Currency.dollars(this.props.discountsProps.fyBasePrice - this.props.discountsProps.studentDiscountAmt),
								DiscountState.superceded,
								self.makeBuyButton(MAGIC_NUMBERS.MEMBERSHIP_TYPE_ID.FULL_YEAR, some(MAGIC_NUMBERS.DISCOUNT_ID.STUDENT_DISCOUNT_ID))
							)}
							{ApPurchaseOptions.discountRow(
								"MGH/Partners Employee",
								Currency.dollars(this.props.discountsProps.fyBasePrice - this.props.discountsProps.mghDiscountAmt),
								DiscountState.eligible,
								self.makeBuyButton(MAGIC_NUMBERS.MEMBERSHIP_TYPE_ID.FULL_YEAR, some(MAGIC_NUMBERS.DISCOUNT_ID.MGH_DISCOUNT_ID))
							)}
							{ApPurchaseOptions.discountRow(
								"Veteran/First Responder",
								Currency.dollars(this.props.discountsProps.fyBasePrice - this.props.discountsProps.veteranDiscountAmt),
								DiscountState.available,
								self.makeBuyButton(MAGIC_NUMBERS.MEMBERSHIP_TYPE_ID.FULL_YEAR, some(MAGIC_NUMBERS.DISCOUNT_ID.VETERAN_DISCOUNT_ID))
							)}
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
							<h2 id="h0-2-60-day-boating-pass-209" style={{ visibility: "visible", fontSize: "1.7em" }}>60 Day Membership: $269</h2>
						</td></tr></tbody></table>
					<p>Includes:</p>
					<ul>
						<li>Access to all boat usage, classes and instruction</li>
						<li>Able to earn all ratings</li>
						<li>Advanced classes for a nominal fee of $35</li>
						<li>Guest privileges can be purchased for $25</li>
					</ul><br />

					<table><tbody><tr><td>
						{self.makeBuyButton(MAGIC_NUMBERS.MEMBERSHIP_TYPE_ID.MEM_30_DAY, none)}
					</td><td>
							<h2 id="h0-2-30-day-boating-pass-209" style={{ visibility: "visible", fontSize: "1.7em" }}>30 Day Membership: $169</h2>
						</td></tr></tbody></table>
					<p>Includes:</p>
					<ul>
						<li>Access to all boat usage, classes and instruction</li>
						<li>Able to earn all ratings</li>
						<li>Advanced classes for a nominal fee of $35</li>
						<li>Guest privileges can be purchased for $25</li>
					</ul><br />


					<table><tbody><tr><td>
						{self.makeBuyButton(MAGIC_NUMBERS.MEMBERSHIP_TYPE_ID.MEM_30_DAY_WICKED_BASIC, none)}
					</td><td>
							<h2 id="h0-3-30-day-intro-to-sailing-99" style={{ visibility: "visible", fontSize: "1.7em" }}>30 Day Wicked Basic, No Frills, Sailing Pass: $99</h2>
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
							<h2 id="h0-3-FY-paddling" style={{ visibility: "visible", fontSize: "1.7em" }}>Full Year Paddling Pass: $189</h2>
						</td></tr></tbody></table>
					<p>Includes:</p>
					<ul>
						<li>Access to our Sit on Top Kayaks and Stand Up Paddleboards</li>
						<li>Guest privileges can be purchased for $25, which covers 1 guest each time on the same double kayak as the member</li>
						<li>Our member's guest discount (half off the day rental rate) is available for 1 Kayak or SUP</li>
					</ul><br />
				</React.Fragment>
			</JoomlaNotitleRegion>
			<Button text="< Back" onClick={self.props.goPrev} />
			{(self.state || {} as any).radio != undefined ? <Button text="Next >" spinnerOnClick onClick={() =>
				self.props.goNext()
			} /> : ""}
		</JoomlaMainPage>
	}
}