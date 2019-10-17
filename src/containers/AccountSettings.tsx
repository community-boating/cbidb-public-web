import { History } from 'history';
import * as React from "react";

import Button from "../components/Button";
import JoomlaArticleRegion from "../theme/joomla/JoomlaArticleRegion";
import JoomlaMainPage from "../theme/joomla/JoomlaMainPage";
import { Form as HomePageForm } from "./HomePage";

export interface Props {
	history: History<any>
}

export default class AccountSettingsPage extends React.PureComponent<Props> {
	render() {
		return <JoomlaMainPage>
			<JoomlaArticleRegion title="Edit Account Info">
				<Button text="< Back" onClick={() => Promise.resolve(this.props.history.push("/"))}/>
			</JoomlaArticleRegion>
		</JoomlaMainPage>
	}
}
