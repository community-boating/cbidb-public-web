import * as React from "react";
import * as t from 'io-ts';
import JoomlaMainPage from "../../theme/joomla/JoomlaMainPage";
import JoomlaArticleRegion from "../../theme/joomla/JoomlaArticleRegion";
import { setCheckoutImage } from "../../util/set-bg-image";
import {donationFundValidator} from "../../async/donation-funds"

export interface Props {
	donationFunds: t.TypeOf<typeof donationFundValidator>[]
}

export default class FundInfoPage extends React.PureComponent<Props> {
	componentDidMount() {
		setCheckoutImage()
		document.getElementById("rt-showcase").remove()
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
		return <JoomlaMainPage setBGImage={setCheckoutImage}>
			<JoomlaArticleRegion title={<span id="funds">CBI Funds</span>}>
				{this.props.donationFunds.filter(FundInfoPage.isNotEndowment).map(FundInfoPage.renderFund)}
				<div style={{ borderLeft: "4px solid", paddingLeft: "4px"}}>
				Donations may be made to one of Community Boating’s permanently restricted endowment funds.
				<br />
				These funds are mutually invested in a managed portfolio.
				</div>
				<br />
				{this.props.donationFunds.filter(FundInfoPage.isEndowment).map(FundInfoPage.renderFund)}
			</JoomlaArticleRegion>
		</JoomlaMainPage>
	}
}
