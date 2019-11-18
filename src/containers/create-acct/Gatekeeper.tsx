import * as React from "react";
import { Link } from "react-router-dom";

import JoomlaArticleRegion from "../../theme/joomla/JoomlaArticleRegion";
import JoomlaMainPage from "../../theme/joomla/JoomlaMainPage";

type Props = {}

export default class Gatekeeper extends React.PureComponent<Props> {
	constructor(props: Props) {
		super(props);
	}
	render() {
		const body = <div>
			Junior Program applications can only be completed by a parent or legal guardian; by continuing you affirm that you are a parent or legal guardian of any and all juniors for whom you submit an application.<br />
			<br />
			If you would like to pay for the membership of a child for whom you are not the parent or legal guardian, please call the boathouse at 617-523-1038 and inquire about purchasing a gift certificate.<br />
			<br />
			<ul>
				<li><Link to="/reserve">
					I am a parent/legal guardian of all juniors I am about to register (or have registered) under my name.
				</Link></li>
				<li><a href="https://portal2.community-boating.org/ords/f?p=610">I'm in the wrong place!  Please take me to Adult Program signups.</a></li>
			</ul>
		</div>

		return <JoomlaMainPage>
			<JoomlaArticleRegion title="You must be the parent or legal guardian.">
				{body}
			</JoomlaArticleRegion>
			</JoomlaMainPage>
	}
}