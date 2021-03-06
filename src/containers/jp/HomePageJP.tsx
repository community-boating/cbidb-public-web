import * as React from "react";
import * as t from 'io-ts';
import { validator } from "@async/member-welcome-jp";
import NavBarLogoutOnly from "@components/NavBarLogoutOnly";
import FactaArticleRegion from "@facta/FactaArticleRegion";
import StandardReport from "@facta/StandardReport";
import homePageActions from "./HomePageActionsJP";
import FactaButton from '@facta/FactaButton';
import { History } from 'history';
import * as moment from 'moment';
import { checkUpgradedAsValidationErrorArray } from '@util/checkUpgraded';
import {FactaErrorDiv} from '@facta/FactaErrorDiv';
import { some } from 'fp-ts/lib/Option';
import {regEmptyPageRoute} from '@routes/jp/regEmpty'
import { checkoutPageRoute } from '@routes/checkout-jp';
import { setJPImage } from '@util/set-bg-image';
import asc from "@app/AppStateContainer";
import FactaMainPage from "@facta/FactaMainPage";

type Props = {
	data: t.TypeOf<typeof validator>,
	history: History<any>
}

type State = {
	validationErrors: string[]
}

export default class HomePageJP extends React.Component<Props, State> {
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
			actions: <ul>{homePageActions(Number(c.actions.getOrElse("")), c.personId, self.props.history, c.openStaggeredOrderId.isSome())}</ul>,
		}))

		const mainTable = <FactaArticleRegion title="My Junior Program Memberships">
			<StandardReport headers={["Name", "Status", "Actions"]} rows={rowData.map(r => [r.name, r.status, r.actions])}/>
		</FactaArticleRegion>

		const checkoutButton = (<FactaButton onClick={() => Promise.resolve(this.props.history.push(checkoutPageRoute.getPathFromArgs({})))} text="Checkout" />);

		const errorPopup = (
			(this.state.validationErrors.length > 0)
			? <FactaErrorDiv errors={this.state.validationErrors}/>
			: ""
		);

		return <FactaMainPage setBGImage={setJPImage} navBar={NavBarLogoutOnly({history: this.props.history, sysdate: some(moment(this.props.data.serverTime)), showProgramLink: true})}>
			{errorPopup}
			{
				asc.state.jpRegistrationClosed
				? <FactaArticleRegion title="Registration is suspended.">
					Junior Program registration is currently suspended.  Please keep an eye on our <a target="_blank" href="https://www.community-boating.org">website</a> for more information!
				</FactaArticleRegion>
				: null
			}
			
			{mainTable}
			{
				asc.state.jpRegistrationClosed
				? null
				: <FactaButton onClick={() => Promise.resolve(this.props.history.push(regEmptyPageRoute.pathWrapper.path))} text="Add new Junior" />
			}			
			{self.props.data.canCheckout ? checkoutButton : null}
		</FactaMainPage>
	}
}
