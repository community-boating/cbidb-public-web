import * as React from "react";
import JoomlaMainPage from "../../theme/joomla/JoomlaMainPage";
import JoomlaArticleRegion from "../../theme/joomla/JoomlaArticleRegion";
import { setCheckoutImage } from "../../util/set-bg-image";
import { Link } from "react-router-dom";
import { jpBasePath } from "../../app/paths/jp/_base";
import { apBasePath } from "../../app/paths/ap/_base";

export interface Props {
	hasJPMemberships: boolean,
	hasAPMemberships: boolean
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
		return (<JoomlaMainPage setBGImage={setCheckoutImage}>
			<JoomlaArticleRegion title="Thank you for your order!">
			Your order is complete!  Please feel free to call us at 617-523-1038 with any questions, or <a href="https://www.community-boating.org">click here</a> to return to our home page.
			{this.props.hasJPMemberships ? 
			<React.Fragment>
			<br />
			<br />
			<Link to={jpBasePath.getPathFromArgs({})}>Click here</Link> to return to the Junior portal where you can register more juniors and sign up for classes.</React.Fragment>
			: ""}
			{this.props.hasAPMemberships ? 
			<React.Fragment>
			<br />
			<br />
			<Link to={apBasePath.getPathFromArgs({})}>Click here</Link> to return to the member portal where you can view your registration status or sign up for classes.</React.Fragment>
			: ""}
			</JoomlaArticleRegion>
		</JoomlaMainPage>);
	}
}
