import * as React from 'react';
import { setCheckoutImage } from 'util/set-bg-image';
import { Link } from 'react-router-dom';
import { giftCertificatesPageRoute } from 'app/routes/gift-certificates';
import FactaMainPage from 'theme/facta/FactaMainPage';
import FactaArticleRegion from 'theme/facta/FactaArticleRegion';

type Props = {
	goNext: () => Promise<void>,
	goPrev: () => Promise<void>,
}

export default class GiftCertificatesThankYouPage extends React.PureComponent<Props> {
	render() {
		return (
			<FactaMainPage setBGImage={setCheckoutImage}>
				<FactaArticleRegion title={"Thank you for your purchase."}>
				Your purchase is complete! Please feel free to call us at 617-523-1038 with any questions.
				<br />
				<br />
				<a href="https://www.community-boating.org">Click here</a> to return to our homepage,
				or <Link to={'redirect' + giftCertificatesPageRoute.getPathFromArgs({})}>click here</Link> if you would like to make another gift certificate purchase.
				</FactaArticleRegion>
			</FactaMainPage>
		)
	}
}