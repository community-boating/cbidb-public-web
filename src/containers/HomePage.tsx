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

export type Form = t.TypeOf<typeof validator>;

type Props = {
	data: Form,
	history: History<any>
}

export default class HomePage extends React.Component<Props> {
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

		const checkoutButton = (<Button onClick={() => Promise.resolve(this.props.history.push("/checkout"))} text="Checkout" />);

		return <JoomlaMainPage navBar={NavBarLogoutOnly({history: this.props.history, sysdate: moment(this.props.data.serverTime)})}>
			{mainTable}
			{/* <Button onClick={() => Promise.resolve(this.props.history.push("/settings"))} text="Edit Parent Info" /> */}
			<Button onClick={() => Promise.resolve(this.props.history.push("/reg"))} text="Add new Junior" />
			{self.props.data.canCheckout ? checkoutButton : null}
		</JoomlaMainPage>
	}
}
