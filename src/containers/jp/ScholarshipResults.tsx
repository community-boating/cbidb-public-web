import * as React from "react";
import FactaArticleRegion from "@facta/FactaArticleRegion"; 
import FactaNotitleRegion from "@facta/FactaNotitleRegion";
import Currency from "@util/Currency";
import FactaButton from "@facta/FactaButton";
import { setJPImage } from "@util/set-bg-image";
import FactaMainPage from "@facta/FactaMainPage";

interface Props {
	jpPrice: Currency,
	jpOffseasonPrice: Currency,
	goNext: () => Promise<void>,
	goPrev: () => Promise<void>,
	breadcrumb: JSX.Element
}

export default class ScholarshipResultsPage extends React.Component<Props> {
	render() {
		return <FactaMainPage setBGImage={setJPImage}>
			<FactaNotitleRegion>
				{this.props.breadcrumb}
			</FactaNotitleRegion>
			<FactaArticleRegion title="Reduced Fee Application">
				Your Junior Program fee for this year has been computed to be <b>{this.props.jpPrice.format()}</b>
				.  This price will automatically apply to all junior memberships you purchase this season.
				<br />
				<br />
				Community Boating Inc.'s sliding scale for membership is based on the <a href="https://livingwage.mit.edu/resources/Living-Wage-User-Guide-and-Technical-Notes-2018.pdf" target="_blank">
					MIT Living Wage Calculator
				</a>
				<br />
				<br />
				If you have a unique circumstance regarding membership fees, please contact Fiona and Niko, Junior Program Co-Directors,
				at <a href="mailto:fiona@community-boating.org">fiona@community-boating.org</a> and <a href="mailto:niko@community-boating.org">niko@community-boating.org</a>.
			</FactaArticleRegion>
			<FactaButton text="Next >" onClick={this.props.goNext}/>
		</FactaMainPage>
	}
}
