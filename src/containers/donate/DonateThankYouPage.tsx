import * as React from 'react';
import JoomlaMainPage from '@joomla/JoomlaMainPage';
import JoomlaArticleRegion from '@joomla/JoomlaArticleRegion';
import { setCheckoutImage } from '@util/set-bg-image';
import { donatePageRoute } from '@routes/donate';
import { Link } from 'react-router-dom';

type Props = {
	goNext: () => Promise<void>,
	goPrev: () => Promise<void>,
}

export default class DonateThankYouPage extends React.PureComponent<Props> {
	render() {
		return (
			<JoomlaMainPage setBGImage={setCheckoutImage}>
				<JoomlaArticleRegion title={"Thank you for your donation."}>
				Your donation is complete! Please feel free to call us at 617-523-1038 with any questions.
				<br />
				<br />
				<a href="https://www.community-boating.org">Click here</a> to return to our homepage,
				or <Link to={'redirect' + donatePageRoute.getPathFromArgs({})}>click here</Link> to make another donation.
				</JoomlaArticleRegion>
			</JoomlaMainPage>
		)
	}
}