import { History } from 'history';
import * as React from "react";

import Button from "../components/Button";
import JoomlaArticleRegion from "../theme/joomla/JoomlaArticleRegion";
import JoomlaMainPage from "../theme/joomla/JoomlaMainPage";
import { Form as HomePageForm } from "./HomePage";
import { Option, none } from 'fp-ts/lib/Option';
import formUpdateState from '../util/form-update-state';
import TextInput from '../components/TextInput';
import {apiw} from "../async/forgot-pw"
import { PostJSON, PostURLEncoded } from '../core/APIWrapper';

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
		const updateState = formUpdateState(this.state, this.setState.bind(this), "formData");
		return <JoomlaMainPage>
			<JoomlaArticleRegion title="Request Submitted.">
				Check your email for a link to reset your password.<br />
				<br />
				If you did not receive an email, double-check the spelling and try again. If you continue to have issues please call the Front Office at 617-523-1038.
			</JoomlaArticleRegion>
			<Button text="< Back" onClick={() => Promise.resolve(self.props.history.push("/"))}/>
		</JoomlaMainPage>
	}
}
