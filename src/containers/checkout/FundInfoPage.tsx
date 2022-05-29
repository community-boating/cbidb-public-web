import * as React from "react";
import * as t from 'io-ts';
import FactaArticleRegion from "theme/facta/FactaArticleRegion";
import { setCheckoutImage } from "util/set-bg-image";
import {donationFundValidator} from "async/donation-funds"
import FactaMainPage from "theme/facta/FactaMainPage";

export interface Props {
	donationFunds: t.TypeOf<typeof donationFundValidator>[]
}

export default class FundInfoPage extends React.PureComponent<Props> {
	componentDidMount() {
		setCheckoutImage()
	}
	static renderFund(fund: t.TypeOf<typeof donationFundValidator>) {
		return (<React.Fragment key={fund.fundId}>
			<b>{fund.fundName}</b><br />
			{fund.portalDescription}
			<br /><br />
		</React.Fragment>)
	}
	static isEndowment(fund: t.TypeOf<typeof donationFundValidator>) {
		return fund.isEndowment;
	}
	static isNotEndowment(fund: t.TypeOf<typeof donationFundValidator>) {
		return !fund.isEndowment;
	}
	render() {
		return <FactaMainPage setBGImage={setCheckoutImage}>
			<FactaArticleRegion title={<span id="funds">CBI Funds</span>}>
				{this.props.donationFunds.filter(FundInfoPage.isNotEndowment).map(FundInfoPage.renderFund)}
				<div style={{ borderLeft: "4px solid", paddingLeft: "4px"}}>
				Donations may be made to one of Community Boating’s permanently restricted endowment funds.
				<br />
				These funds are mutually invested in a managed portfolio.
				</div>
				<br />
				{this.props.donationFunds.filter(FundInfoPage.isEndowment).map(FundInfoPage.renderFund)}
			</FactaArticleRegion>
		</FactaMainPage>
	}
}
