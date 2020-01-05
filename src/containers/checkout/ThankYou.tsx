import * as React from "react";
import JoomlaMainPage from "../../theme/joomla/JoomlaMainPage";
import JoomlaArticleRegion from "../../theme/joomla/JoomlaArticleRegion";
import { setCheckoutImage } from "../../util/set-bg-image";
import { Link } from "react-router-dom";

export interface Props {

}

type State = {
	validationErrors: string[]
}

export default class ThankYouPage extends React.PureComponent<Props, State> {
	constructor(props: Props) {
		super(props);
		this.state = {
			validationErrors: []
		};
	}
	componentDidMount() {
		setCheckoutImage()
	}
	render() {
		return (<JoomlaMainPage>
			<JoomlaArticleRegion title="Thank you for your order!">
			Your order is complete!  Please feel free to call us at 617-523-1038 with any questions.
			<br />
			<br />
			<Link to="/">Click here</Link> to return to the Junior portal where you can register more juniors and sign up for classes, or <a href="https://www.community-boating.org">click here</a> to return to our home page.
			</JoomlaArticleRegion>
		</JoomlaMainPage>);
	}
}
