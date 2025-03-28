import * as React from "react";
import * as t from 'io-ts';
import { validator } from "async/member-welcome-jp";
import NavBarLogoutOnly from "components/NavBarLogoutOnly";
import FactaArticleRegion from "theme/facta/FactaArticleRegion";
import StandardReport from "theme/facta/StandardReport";
import homePageActions from "./HomePageActionsJP";
import FactaButton from 'theme/facta/FactaButton';
import { History } from 'history';
import * as moment from 'moment';
import { checkUpgradedAsValidationErrorArray } from 'util/checkUpgraded';
import {FactaErrorDiv} from 'theme/facta/FactaErrorDiv';
import { some } from 'fp-ts/lib/Option';
import {regEmptyPageRoute} from 'app/routes/jp/regEmpty'
import { checkoutPageRoute } from 'app/routes/checkout-jp';
import { setJPImage } from 'util/set-bg-image';
import asc from "app/AppStateContainer";
import FactaMainPage from "theme/facta/FactaMainPage";

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

		const now = moment();
		const month = Number(now.format("M"));
		const year = Number(now.format("YYYY"));

		const isPreSeason = month < 7;
		const closedSeason = isPreSeason ? year-1 : year;

		return <FactaMainPage setBGImage={setJPImage} navBar={NavBarLogoutOnly({history: this.props.history, sysdate: some(moment(this.props.data.serverTime)), showProgramLink: true})} errors={this.state.validationErrors}>
			{
				asc.state.jpRegistrationClosed
				? <FactaArticleRegion title="Registration is closed.">
					Registration is closed for the {closedSeason} season. Please keep an eye on our <a target="_blank" href="https://www.community-boating.org">website</a> for when registration will open for {closedSeason+1}.
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
