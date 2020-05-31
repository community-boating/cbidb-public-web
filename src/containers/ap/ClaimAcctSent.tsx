import * as React from "react";
import Button from '../../components/Button';
import JoomlaArticleRegion from '../../theme/joomla/JoomlaArticleRegion';
import { setAPImage } from '../../util/set-bg-image';
import {History} from "history"
import JoomlaMainPage from '../../theme/joomla/JoomlaMainPage';
import { apLoginPageRoute } from '../../app/routes/ap/_base';

type Props = {
	history: History<any>
}

type State = {
}


export default class ClaimAcctSent extends React.PureComponent<Props, State> {
	render() {
		const buttons = <div>
			<Button text="< Back" onClick={() => Promise.resolve(this.props.history.push(apLoginPageRoute.getPathFromArgs({})))}/>
		</div>


		return <JoomlaMainPage setBGImage={setAPImage}>
			<JoomlaArticleRegion title="Request submitted." buttons={buttons}>
			Check your email for instructions on how to claim your record.
			<br />
			<br />
			If you did not receive an email, double-check the spelling and try again.
			If you continue to have problems please call the Front Office at 617-523-1038.
			</JoomlaArticleRegion>
		</JoomlaMainPage>
	}
}