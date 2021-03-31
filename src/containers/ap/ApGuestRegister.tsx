import * as React from "react";
import { setAPImage } from "../../util/set-bg-image";
import FactaArticleRegion from "../../theme/facta/FactaArticleRegion";
import { History } from 'history'
//import { jpBasePath } from "../../app/paths/jp/_base";
import { Link } from "react-router-dom";
//import { apCreateAcctRoute } from "../../app/routes/ap/create-acct";
import FactaMainPage from "../../theme/facta/FactaMainPage";

type Props = {
	history: History<any>
}

type State = {
}


export default class ApPreRegister extends React.PureComponent<Props, State> {
	render() {
		return <FactaMainPage setBGImage={setAPImage}>
			<FactaArticleRegion title="Register as a Guest">
				Guests must self register. Members please direct your guests to this page to register themselves. Children must be registered by a parent or guardian.
				<br />
				<iframe title="Waiver of Liability" src="../../waivers/live/ApGuestWaiver.html" width="100%"></iframe>
			</FactaArticleRegion>
		</FactaMainPage>
	}
}
