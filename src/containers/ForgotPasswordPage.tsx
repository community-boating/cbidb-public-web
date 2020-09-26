import { History } from 'history';
import * as React from "react";

import JoomlaButton from "../theme/joomla/JoomlaButton";
import FactaArticleRegion from "../theme/facta/FactaArticleRegion";
import { Option, none } from 'fp-ts/lib/Option';
import formUpdateState from '../util/form-update-state';
import TextInput from '../components/TextInput';
import {apiw} from "../async/forgot-pw"
import { PostURLEncoded } from '../core/APIWrapperUtil';
import {FactaErrorDiv} from '../theme/facta/FactaErrorDiv';
import { jpForgotPasswordSentPageRoute } from '../app/routes/jp/forgot-pw-sent';
import { setAPImage, setJPImage } from '../util/set-bg-image';
import { PageFlavor } from '../components/Page';
import assertNever from '../util/assertNever';
import { apForgotPasswordSentPageRoute } from '../app/routes/ap/forgot-pw-sent';
import { apBasePath } from '../app/paths/ap/_base';
import { jpBasePath } from '../app/paths/jp/_base';
import FactaMainPage from '../theme/facta/FactaMainPage';

type Props = {
	history: History<any>,
	program: PageFlavor
}

type Form = {
	email: Option<string>
}

type State = {
	formData: Form,
	validationErrors: string[]
}

class FormInput extends TextInput<Form> {}

export default class ForgotPasswordPage extends React.PureComponent<Props, State> {
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
		const updateState = formUpdateState(this.state, this.setState.bind(this), "formData");
		const errorPopup = (
			(this.state.validationErrors.length > 0)
			? <FactaErrorDiv errors={this.state.validationErrors}/>
			: ""
		);
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
		const nextLink = (function() {
			switch (self.props.program) {
				case PageFlavor.AP:
					return apForgotPasswordSentPageRoute.getPathFromArgs({});
				case PageFlavor.JP:
					return jpForgotPasswordSentPageRoute.getPathFromArgs({});
				default:
					assertNever(self.props.program);
					return null;
				}
		}());
		const loginLink = (function() {
			switch (self.props.program) {
				case PageFlavor.AP:
					return apBasePath.getPathFromArgs({});
				case PageFlavor.JP:
					return jpBasePath.getPathFromArgs({});
				default:
					assertNever(self.props.program);
					return null;
				}
		}());
		const submit = () => {
			self.setState({
				...self.state,
				validationErrors: []
			});
			return apiw.send(PostURLEncoded({ email: this.state.formData.email.getOrElse(""), program: this.props.program })).then(
				// api success
				ret => {
					if (ret.type == "Success") {
						self.props.history.push(nextLink)
					} else {
						window.scrollTo(0, 0);
						self.setState({
							...self.state,
							validationErrors: ret.message.split("\\n") // TODO
						});
					}
				}
			)
		}
		return <FactaMainPage setBGImage={setBGImage}>
			{errorPopup}
			<FactaArticleRegion title="Enter your email address and we'll get your password reset.">
				<table><tbody>
					<FormInput
						id="email"
						label="Email"
						value={this.state.formData.email}
						updateAction={updateState}
						onEnter={submit}
					/>
				</tbody></table>
			</FactaArticleRegion>
			<JoomlaButton text="< Back" onClick={() => Promise.resolve(self.props.history.push(loginLink))}/>
			<JoomlaButton text="Next >" onClick={submit}/>
		</FactaMainPage>
	}
}
