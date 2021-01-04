import * as React from 'react';
import JoomlaMainPage from '../../theme/joomla/JoomlaMainPage';
import JoomlaArticleRegion from '../../theme/joomla/JoomlaArticleRegion';
import { setCheckoutImage } from '../../util/set-bg-image';
import Button from '../../components/Button';
import { DonationThirdPartyWidget } from '../../components/DonationThirdPartyWidget';

type Props = {
	goNext: () => Promise<void>,
	goPrev: () => Promise<void>,
}

export default class DonateDetailsPage extends React.PureComponent<Props> {
	render() {
		return (
			<JoomlaMainPage setBGImage={setCheckoutImage}>
				<JoomlaArticleRegion title={"Support Community Boating!"}>
					<DonationThirdPartyWidget />
					<br />
					Community Boating, Inc. is a private, 501(c)3 non-profit organization operating affordable and accessible programs
					for kids, adults and individuals with special needs under the mission of 'sailing for all.'
					<br />
					<br />
					You can donate to multiple areas if you wish; simply choose a fund, click "Add Donation," and repeat for as many funds as you like.
					<Button text="< Back" onClick={this.props.goPrev}/>
					<Button text="Next >" spinnerOnClick onClick={this.props.goNext}/>
				</JoomlaArticleRegion>
			</JoomlaMainPage>
		)
	}
}