import { History } from 'history';
import * as React from "react";

import Button from "../components/Button";
import JoomlaArticleRegion from "../theme/joomla/JoomlaArticleRegion";
import JoomlaMainPage from "../theme/joomla/JoomlaMainPage";
import { none } from 'fp-ts/lib/Option';
import { setJPImage } from '../util/set-bg-image';

type Props = {
	history: History<any>
}

export default class ForgotPasswordSentPage extends React.PureComponent<Props> {
	constructor(props: Props) {
		super(props);
		this.state = {
			formData: {
				email: none
			},
			validationErrors: []
		}
	}
	render() {
		const self = this;
		return <JoomlaMainPage setBGImage={setJPImage}>
			<JoomlaArticleRegion title="Request Submitted.">
				Check your email for a link to reset your password.<br />
				<br />
				If you did not receive an email, double-check the spelling and try again. If you continue to have issues please call the Front Office at 617-523-1038.
			</JoomlaArticleRegion>
			<Button text="< Back" onClick={() => Promise.resolve(self.props.history.push("/"))}/>
		</JoomlaMainPage>
	}
}
