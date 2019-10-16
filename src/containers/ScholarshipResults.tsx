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
			<JoomlaArticleRegion title="Scholarship Results">
				Your Junior Program fee for this year has been computed to be <b>{this.props.jpPrice.format()}</b>
				, and your (optional) off-season class fee has been computed to be <b>{this.props.jpOffseasonPrice.format()}</b>
				.  This price will automatically apply to all junior memberships you purchase this season.
				<br />
				<br />
				Community Boating Inc.'s sliding scale for membership is based on the <a href="http://www.liveworkthrive.org/site/assets/docs/MASS%20INDEX%20FINALWEB.pdf" target="_blank">
					Crittenton Women's Union Economic Independence Index
				</a>
				. This index reports what it takes for a family to make ends meet in Massachusetts without relying on public or private assistance, taking into account family size and makeup.
				<br />
				<br />
				If you have a unique circumstance regarding membership fees, please contact Niko Kotsatos, Junior Program Director, at <a href="mailto:niko@community-boating.org">niko@community-boating.org</a>.
			</JoomlaArticleRegion>
			<Button text="Next >" onClick={this.props.goNext}/>
		</JoomlaMainPage>
	}
}