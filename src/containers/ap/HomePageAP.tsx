import * as t from 'io-ts';
import * as React from "react";

import { validator } from "async/member-welcome-ap";
import NavBarLogoutOnly from "components/NavBarLogoutOnly";
import FactaArticleRegion from "theme/facta/FactaArticleRegion";
import StandardReport from "theme/facta/StandardReport";
import { History } from 'history';
import * as moment from 'moment';
import { checkUpgradedAsValidationErrorArray } from 'util/checkUpgraded';
import {FactaErrorDiv} from 'theme/facta/FactaErrorDiv';
import { some } from 'fp-ts/lib/Option';
import { checkoutPageRoute } from 'app/routes/checkout-ap';
import { setAPImage } from 'util/set-bg-image';
import homePageActions from "./HomePageActionsAP";
import Currency from 'util/Currency';
import FactaMainPage from 'theme/facta/FactaMainPage';
import FactaButton from 'theme/facta/FactaButton';

type Props = {
	data:  t.TypeOf<typeof validator>,
	history: History<any>
}

type State = {
	validationErrors: string[]
}

export default class HomePageAP extends React.Component<Props, State> {
	constructor(props: Props) {
		super(props);
		this.state = {
			validationErrors: checkUpgradedAsValidationErrorArray(this.props.history, (process.env as any).eFuse)
		}
	}
	render() {
		const self = this;

		const expirationDate = self.props.data.expirationDate.map(d => moment(d))

		const isVolunteer = self.props.data.hasBasicVolunteerRating && self.props.data.volunteerGoodStanding

		const mainTable = <FactaArticleRegion title="My Membership">
			<StandardReport
				headers={["Name", "Status", "Actions"]}
				rows={[[
					`${self.props.data.firstName} ${self.props.data.lastName}`,
					self.props.data.status,
					homePageActions(
						self.props.data.actions,
						self.props.data.personId,
						self.props.history,
						Currency.dollars(self.props.data.discountsResult.renewalDiscountAmt),
						expirationDate,
						self.props.data.show4thLink,
						self.props.data.openStaggeredOrderId.isSome(),
						isVolunteer
					)
				]]}
				rawHtml={{1: true}}
			/>
		</FactaArticleRegion>

		const ratings = <FactaArticleRegion title="My Ratings">
			<div style={{display: "flex", flexDirection: "row", flexWrap: "wrap"}}>
				<div style={{verticalAlign: "top", padding: "0 20px 20px 0"}}><span dangerouslySetInnerHTML={{__html: self.props.data.ratings}}/></div>
				{(
					isVolunteer
					? <div><span dangerouslySetInnerHTML={{__html: self.props.data.volRatings}}/></div>
					: null
				)}
			</div>
			<p>
				<span style={{fontWeight: "bold", color:"red"}}>Acquired Rating</span>
				<br />
				Unacquired Rating
			</p>
		</FactaArticleRegion>;

		const checkoutButton = (<div style={{marginBottom: "30px"}}><FactaButton onClick={() => Promise.resolve(this.props.history.push(checkoutPageRoute.getPathFromArgs({})))} text="Checkout" /></div>);

		const errorPopup = (
			(this.state.validationErrors.length > 0)
			? <FactaErrorDiv errors={this.state.validationErrors}/>
			: ""
		);

		return <FactaMainPage setBGImage={setAPImage} navBar={NavBarLogoutOnly({history: this.props.history, sysdate: some(moment(this.props.data.serverTime)), showProgramLink: true})} errors={this.state.validationErrors}>
			{mainTable}
			{self.props.data.canCheckout ? checkoutButton : null}
			{ratings}
		</FactaMainPage>
	}
}
