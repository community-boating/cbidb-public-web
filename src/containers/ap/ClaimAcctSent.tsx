import * as React from "react";
import JoomlaButton from '../../theme/facta/FactaButton';
import FactaArticleRegion from '../../theme/facta/FactaArticleRegion';
import { setAPImage } from '../../util/set-bg-image';
import {History} from "history"
import { apLoginPageRoute } from "../../app/routes/ap/login";
import FactaMainPage from "../../theme/facta/FactaMainPage";

type Props = {
	history: History<any>
}

type State = {
}


export default class ClaimAcctSent extends React.PureComponent<Props, State> {
	render() {
		const buttons = <div>
			<JoomlaButton text="< Back" onClick={() => Promise.resolve(this.props.history.push(apLoginPageRoute.getPathFromArgs({})))}/>
		</div>


		return <FactaMainPage setBGImage={setAPImage}>
			<FactaArticleRegion title="Request submitted." buttons={buttons}>
			Check your email for instructions on how to claim your record.
			<br />
			<br />
			If you did not receive an email, double-check the spelling and try again.
			If you continue to have problems please call the Front Office at 617-523-1038.
			</FactaArticleRegion>
		</FactaMainPage>
	}
}