import * as React from 'react';
import { setCheckoutImageForDonations } from 'util/set-bg-image';
import { donatePageRoute } from 'app/routes/donate';
import { Link } from 'react-router-dom';
import FactaMainPage from 'theme/facta/FactaMainPage';
import FactaArticleRegion from 'theme/facta/FactaArticleRegion';

type Props = {
	goNext: () => Promise<void>,
	goPrev: () => Promise<void>,
}

export default class DonateThankYouPage extends React.PureComponent<Props> {
	render() {
		return (
			<FactaMainPage setBGImage={setCheckoutImageForDonations}>
				<FactaArticleRegion title={"Thank you for your donation."}>
				Your donation is complete! Please feel free to call us at 617-523-1038 with any questions.
				<br />
				<br />
				<a href="https://www.community-boating.org">Click here</a> to return to our homepage,
				or <Link to={'redirect' + donatePageRoute.getPathFromArgs({})}>click here</Link> to make another donation.
				</FactaArticleRegion>
			</FactaMainPage>
		)
	}
}