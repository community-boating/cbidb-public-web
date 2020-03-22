import * as t from 'io-ts';
import * as React from "react";

import { validator } from "../async/member-welcome";
import NavBarLogoutOnly from "../components/NavBarLogoutOnly";
import JoomlaArticleRegion from "../theme/joomla/JoomlaArticleRegion";
import JoomlaMainPage from "../theme/joomla/JoomlaMainPage";
import JoomlaReport from "../theme/joomla/JoomlaReport";
import homePageActions from "./HomePageActions";
import Button from '../components/Button';
import { History } from 'history';
import moment = require('moment');
import { checkUpgradedAsValidationErrorArray } from '../util/checkUpgraded';
import ErrorDiv from '../theme/joomla/ErrorDiv';
import { some } from 'fp-ts/lib/Option';
import {regEmptyPageRoute} from '../app/routes/jp/regEmpty'
import { checkoutPageRoute } from '../app/routes/common/checkout';
import { setJPImage } from '../util/set-bg-image';

export type Form = t.TypeOf<typeof validator>;

type Props = {
	data: Form,
	history: History<any>
}

type State = {
	validationErrors: string[]
}

export default class HomePage extends React.Component<Props, State> {
	constructor(props: Props) {
		super(props);
		this.state = {
			validationErrors: checkUpgradedAsValidationErrorArray(this.props.history, (process.env as any).eFuse)
		}
	}
	componentDidMount() {
		if (this.props.data.children.length == 0) {
			this.props.history.push(regEmptyPageRoute.pathWrapper.path)
		}
	}
	render() {
		const self = this;
		const rowData: {
			personId: number,
			name: string,
			status: React.ReactNode,
			actions: React.ReactNode
		}[] = this.props.data.children.map((c) => ({
			personId: c.personId,
			name: c.nameFirst.getOrElse("") + " " + c.nameLast.getOrElse(""),
			status: <span dangerouslySetInnerHTML={{__html: c.status.getOrElse("")}}/>,
			actions: <ul>{homePageActions(Number(c.actions.getOrElse("")), c.personId, self.props.history)}</ul>,
		}))

		const mainTable = <JoomlaArticleRegion title="My Junior Program Memberships">
			<JoomlaReport headers={["Name", "Status", "Actions"]} rows={rowData.map(r => [r.name, r.status, r.actions])}/>
		</JoomlaArticleRegion>

		const checkoutButton = (<Button onClick={() => Promise.resolve(this.props.history.push(checkoutPageRoute.getPathFromArgs({})))} text="Checkout" />);

		const errorPopup = (
			(this.state.validationErrors.length > 0)
			? <ErrorDiv errors={this.state.validationErrors}/>
			: ""
		);

		return <JoomlaMainPage setBGImage={setJPImage} navBar={NavBarLogoutOnly({history: this.props.history, sysdate: some(moment(this.props.data.serverTime))})}>
			{errorPopup}
			{mainTable}
			{/* <Button onClick={() => Promise.resolve(this.props.history.push("/settings"))} text="Edit Parent Info" /> */}
			<Button onClick={() => Promise.resolve(this.props.history.push(regEmptyPageRoute.pathWrapper.path))} text="Add new Junior" />
			{self.props.data.canCheckout ? checkoutButton : null}
		</JoomlaMainPage>
	}
}
