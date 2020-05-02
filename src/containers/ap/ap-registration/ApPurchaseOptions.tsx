import { none } from "fp-ts/lib/Option";
import { History } from "history";
import * as React from "react";
import * as t from 'io-ts';

import Button from "../../../components/Button";
import JoomlaMainPage from "../../../theme/joomla/JoomlaMainPage";
import JoomlaNotitleRegion from "../../../theme/joomla/JoomlaNotitleRegion";
import NavBarLogoutOnly from "../../../components/NavBarLogoutOnly";
import { setAPImage } from "../../../util/set-bg-image";
import {validator as discountValidator} from "../../../async/member/discount-eligibility"

type DiscountEligibility = t.TypeOf<typeof discountValidator>;

interface Props {
	discountEligibility: DiscountEligibility,
	history: History<any>
	breadcrumb: JSX.Element,
	goNext: () => Promise<void>,
	goPrev: () => Promise<void>
}

export default class ApPurchaseOptions extends React.Component<Props, { radio: string }> {
	render() {
		const self = this;
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
						<a href="#" className="readon" style={{ margin: "0 5px" }}><span>Buy</span></a>
					</td><td>
							<h2 style={{ visibility: "visible", fontSize: "1.7em" }}>One Year Membership Renewal: $295</h2>
						</td></tr></tbody></table>
					<br /><table style={{ fontWeight: "bold" }}>
						<tbody><tr><td style={{ textAlign: "right" }}>Sr. Citizen (65+):</td><td>$245</td><td><span className="not-available"> - Not available online.</span></td></tr>

						</tbody></table>
					<span style={{ fontSize: "0.8em", fontStyle: "italic" }}>(Discounts available online only to those that have previously verified their date of birth with the Front Office)</span>
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
						<a href="#" className="readon" style={{ margin: "0 5px" }}><span>Buy</span></a>
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
						<a href="#" className="readon" style={{ margin: "0 5px" }}><span>Buy</span></a>
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
						<a href="#" className="readon" style={{ margin: "0 5px" }}><span>Buy</span></a>
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
						<a href="#" className="readon" style={{ margin: "0 5px" }}><span>Buy</span></a>
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