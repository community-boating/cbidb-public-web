import * as React from "react";
import * as t from 'io-ts';
import { validator } from "../../async/member-welcome-jp";
import NavBarLogoutOnly from "../../components/NavBarLogoutOnly";
import FactaArticleRegion from "../../theme/facta/FactaArticleRegion";
import JoomlaReport from "../../theme/joomla/JoomlaReport";
import homePageActions from "./HomePageActionsJP";
import JoomlaButton from '../../theme/facta/FactaButton';
import { History } from 'history';
import moment = require('moment');
import { checkUpgradedAsValidationErrorArray } from '../../util/checkUpgraded';
import {FactaErrorDiv} from '../../theme/facta/FactaErrorDiv';
import { some } from 'fp-ts/lib/Option';
import {regEmptyPageRoute} from '../../app/routes/jp/regEmpty'
import { checkoutPageRoute } from '../../app/routes/common/checkout';
import { setJPImage } from '../../util/set-bg-image';
import asc from "../../app/AppStateContainer";
import FactaMainPage from "../../theme/facta/FactaMainPage";

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
			actions: <ul>{homePageActions(Number(c.actions.getOrElse("")), c.personId, self.props.history)}</ul>,
		}))

		const mainTable = <FactaArticleRegion title="My Junior Program Memberships">
			<JoomlaReport headers={["Name", "Status", "Actions"]} rows={rowData.map(r => [r.name, r.status, r.actions])}/>
		</FactaArticleRegion>

		const checkoutButton = (<JoomlaButton onClick={() => Promise.resolve(this.props.history.push(checkoutPageRoute.getPathFromArgs({})))} text="Checkout" />);

		const errorPopup = (
			(this.state.validationErrors.length > 0)
			? <FactaErrorDiv errors={this.state.validationErrors}/>
			: ""
		);

		return <FactaMainPage setBGImage={setJPImage} navBar={NavBarLogoutOnly({history: this.props.history, sysdate: some(moment(this.props.data.serverTime)), showProgramLink: true})}>
			{errorPopup}
			{
				asc.state.jpClosedCovid
				? <FactaArticleRegion title="Registration is suspended.">
					Thank you for your patience and support this spring.
					We regret to inform you that CBI will not be able to offer the 2020 edition of our summer Junior Program.
					If we find later this summer that we can safely offer some limited youth events or other opportunities, we will notify you right away!  
				</FactaArticleRegion>
				: null
			}
			
			{mainTable}
			{
				asc.state.jpClosedCovid
				? null
				: <JoomlaButton onClick={() => Promise.resolve(this.props.history.push(regEmptyPageRoute.pathWrapper.path))} text="Add new Junior" />
			}			
			{self.props.data.canCheckout ? checkoutButton : null}
		</FactaMainPage>
	}
}
