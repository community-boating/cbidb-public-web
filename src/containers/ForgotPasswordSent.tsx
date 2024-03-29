import { History } from 'history';
import * as React from "react";

import FactaButton from "theme/facta/FactaButton";
import FactaArticleRegion from "theme/facta/FactaArticleRegion";
import { none } from 'fp-ts/lib/Option';
import { setAPImage, setJPImage } from 'util/set-bg-image';
import { PageFlavor } from 'components/Page';
import { apPathLogin } from 'app/paths/ap/login';
import { jpPathLogin } from 'app/paths/jp/login';
import FactaMainPage from 'theme/facta/FactaMainPage';

type Props = {
	history: History<any>,
	program: PageFlavor
}

export default class ForgotPasswordSentPage extends React.PureComponent<Props> {
	constructor(props: Props) {
		super(props);
		this.state = {
			formData: {
				email: none
			},
			validationErrors: []
		}
	}
	render() {
		const self = this;
		const setBGImage = (function() {
			switch (self.props.program) {
			case PageFlavor.AP:
				return setAPImage;
			case PageFlavor.JP:
				return setJPImage;
			default:
				return null;
			}
		}());
		const loginLink = (function() {
			switch (self.props.program) {
				case PageFlavor.AP:
					return apPathLogin.getPathFromArgs({});
				case PageFlavor.JP:
					return jpPathLogin.getPathFromArgs({});
				default:
					return null;
				}
		}());
		return <FactaMainPage setBGImage={setBGImage}>
			<FactaArticleRegion title="Request Submitted.">
				Check your email for a link to reset your password.<br />
				<br />
				If you did not receive an email, double-check the spelling and try again. If you continue to have issues please call the Front Office at 617-523-1038.
			</FactaArticleRegion>
			<FactaButton text="< Back" onClick={() => Promise.resolve(self.props.history.push(loginLink))}/>
		</FactaMainPage>
	}
}
