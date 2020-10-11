import * as React from 'react';
import JoomlaMainPage from '../../theme/joomla/JoomlaMainPage';
import JoomlaArticleRegion from '../../theme/joomla/JoomlaArticleRegion';
import { setCheckoutImage } from '../../util/set-bg-image';
import Button from '../../components/Button';

type Props = {
	goNext: () => Promise<void>,
	goPrev: () => Promise<void>,
}

export default class GiftCertificatesDetailsPage extends React.PureComponent<Props> {
	render() {
		return (
			<JoomlaMainPage setBGImage={setCheckoutImage}>
				<JoomlaArticleRegion title={"Purchase a gift certificate to Community Boating!"}>
					First GC page
					<Button text="< Back" onClick={this.props.goPrev}/>
					<Button text="Next >" spinnerOnClick onClick={this.props.goNext}/>
				</JoomlaArticleRegion>
			</JoomlaMainPage>
		)
	}
}