import * as t from 'io-ts';
import * as React from "react";

import { validator } from "../async/member-welcome-ap";
import NavBarLogoutOnly from "../components/NavBarLogoutOnly";
import JoomlaArticleRegion from "../theme/joomla/JoomlaArticleRegion";
import JoomlaMainPage from "../theme/joomla/JoomlaMainPage";
import JoomlaReport from "../theme/joomla/JoomlaReport";
import Button from '../components/Button';
import { History } from 'history';
import moment = require('moment');
import { checkUpgradedAsValidationErrorArray } from '../util/checkUpgraded';
import ErrorDiv from '../theme/joomla/ErrorDiv';
import { some } from 'fp-ts/lib/Option';
import { checkoutPageRoute } from '../app/routes/common/checkout';
import { setAPImage } from '../util/set-bg-image';
import homePageActions from "./HomePageActionsAP";

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

		const mainTable = <JoomlaArticleRegion title="My Membership">
			<JoomlaReport
				headers={["Name", "Status", "Actions"]}
				rows={[[
					`${self.props.data.firstName} ${self.props.data.lastName}`,
					self.props.data.status,
					homePageActions(self.props.data.actions, self.props.data.personId, self.props.history)
				]]}
				rawHtml={{1: true}}
			/>
		</JoomlaArticleRegion>

		const ratings = <JoomlaArticleRegion title="My Ratings">
			<span dangerouslySetInnerHTML={{__html: self.props.data.ratings}}/>
			<p>
				<span style={{fontWeight: "bold", color:"red"}}>Acquired Rating</span>
				<br />
				Unacquired Rating
			</p>
		</JoomlaArticleRegion>;

		const checkoutButton = (<Button onClick={() => Promise.resolve(this.props.history.push(checkoutPageRoute.getPathFromArgs({})))} text="Checkout" />);

		const errorPopup = (
			(this.state.validationErrors.length > 0)
			? <ErrorDiv errors={this.state.validationErrors}/>
			: ""
		);

		return <JoomlaMainPage setBGImage={setAPImage} navBar={NavBarLogoutOnly({history: this.props.history, sysdate: some(moment(this.props.data.serverTime))})}>
			{errorPopup}
			{mainTable}
			{self.props.data.canCheckout ? checkoutButton : null}
			{ratings}
		</JoomlaMainPage>
	}
}
