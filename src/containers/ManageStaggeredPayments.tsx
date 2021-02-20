import { History } from 'history';
import * as React from "react";

import JoomlaArticleRegion from "../theme/joomla/JoomlaArticleRegion";
import JoomlaMainPage from "../theme/joomla/JoomlaMainPage";

import { setAPImage, setJPImage } from '../util/set-bg-image';
import { PageFlavor } from '../components/Page';
import assertNever from '../util/assertNever';


type Props = {
	history: History<any>,
	program: PageFlavor,
	orderId: number
}

export default class ManageStaggeredPayments extends React.PureComponent<Props> {
	render() {
		const self = this;
		const setBGImage = (function() {
			switch (self.props.program) {
			case PageFlavor.AP:
				return setAPImage;
			case PageFlavor.JP:
				return setJPImage;
			default:
				assertNever(self.props.program);
				return null;
			}
		}());
		return <JoomlaMainPage setBGImage={setBGImage}>
			<JoomlaArticleRegion title="Manage Upcoming Payments">
			</JoomlaArticleRegion>
		</JoomlaMainPage>
	}
}
