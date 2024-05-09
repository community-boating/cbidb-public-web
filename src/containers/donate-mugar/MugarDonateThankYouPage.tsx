import * as React from 'react';
import { setMugarImage } from 'util/set-bg-image';
import FactaMainPage from 'theme/facta/FactaMainPage';
import FactaArticleRegion from 'theme/facta/FactaArticleRegion';

type Props = {
	goNext: () => Promise<void>,
	goPrev: () => Promise<void>,
}

export default class MugarDonateThankYouPage extends React.PureComponent<Props> {
	render() {
		return (
			<FactaMainPage setBGImage={setMugarImage}>
				<FactaArticleRegion title={"Thank you for your donation."}>
				Your donation is complete! Please feel free to call us at 617-523-1038 with any questions.
				<br />
				<br />
				<a href="https://www.community-boating.org">Click here</a> to return to our homepage.
				</FactaArticleRegion>
			</FactaMainPage>
		)
	}
}