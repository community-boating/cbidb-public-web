import * as React from "react";
import JoomlaArticleRegion from "../theme/joomla/JoomlaArticleRegion";
import JoomlaMainPage from "../theme/joomla/JoomlaMainPage";
import JoomlaNotitleRegion from "../theme/joomla/JoomlaNotitleRegion";
import Currency from "../util/Currency";
import Button from "../components/Button";

interface Props {
	jpPrice: Currency,
	jpOffseasonPrice: Currency,
	goNext: () => Promise<void>,
	goPrev: () => Promise<void>,
	breadcrumb: JSX.Element
}

export default class ScholarshipResultsPage extends React.Component<Props> {
	render() {
		return <JoomlaMainPage>
			<JoomlaNotitleRegion>
				{this.props.breadcrumb}
			</JoomlaNotitleRegion>
			<JoomlaArticleRegion title="Reduced Fee Application">
				Your Junior Program fee for this year has been computed to be <b>{this.props.jpPrice.format()}</b>
				.  This price will automatically apply to all junior memberships you purchase this season.
				<br />
				<br />
				Community Boating Inc.'s sliding scale for membership is based on the <a href="https://livingwage.mit.edu/resources/Living-Wage-User-Guide-and-Technical-Notes-2018.pdf" target="_blank">
					MIT Living Wage Calculator
				</a>
				<br />
				<br />
				If you have a unique circumstance regarding membership fees, please contact Niko Kotsatos, Junior Program Director, at <a href="mailto:niko@community-boating.org">niko@community-boating.org</a>.
			</JoomlaArticleRegion>
			<Button text="Next >" onClick={this.props.goNext}/>
		</JoomlaMainPage>
	}
}