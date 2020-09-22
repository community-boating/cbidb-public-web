import { Option, none } from 'fp-ts/lib/Option';
import * as React from "react";
import TextInput from '../../components/TextInput';
import formUpdateState from '../../util/form-update-state';
import JoomlaButton from '../../theme/joomla/JoomlaButton';
import ErrorDiv from '../../theme/joomla/ErrorDiv';
import FactaArticleRegion from '../../theme/facta/FactaArticleRegion';
import { setAPImage } from '../../util/set-bg-image';
import {History} from "history"
import { PostURLEncoded } from '../../core/APIWrapperUtil';
import {postWrapper} from "../../async/member/start-claim-acct"
import { apPathClaimAcctSent } from '../../app/paths/ap/claim-acct-sent';
import { apBasePath } from '../../app/paths/ap/_base';
import FactaMainPage from '../../theme/facta/FactaMainPage';

const defaultForm = {
	email: none as Option<string>
}

type Form = typeof defaultForm

type Props = {
	history: History<any>
}

type State = {
	formData: Form,
	validationErrors: string[]
}

class FormInput extends TextInput<Form> {}

export default class StartClaimAcct extends React.PureComponent<Props, State> {
	constructor(props: Props) {
		super(props);
		this.state = {
			formData: defaultForm,
			validationErrors: []
		}
	}
	render() {
		const self= this;
		const updateState = formUpdateState(this.state, this.setState.bind(this), "formData");

		const submit = () => {
			return postWrapper.send(PostURLEncoded({
				email: self.state.formData.email.getOrElse("")
			})).then(res => {
				if (res.type == "Success") {
					self.props.history.push(apPathClaimAcctSent.getPathFromArgs({}))
				} else {
					self.setState({
						...self.state,
						validationErrors: res.message.split("\\n")
					})
				}
				return Promise.resolve();
			})
		}

		const buttons = <div>
			<JoomlaButton text="< Back" onClick={() => Promise.resolve(self.props.history.push(apBasePath.getPathFromArgs({})))}/>
			<JoomlaButton text="Submit" spinnerOnClick onClick={submit}/>
		</div>

		const errorPopup = (
			(this.state.validationErrors.length > 0)
			? <ErrorDiv errors={this.state.validationErrors}/>
			: ""
		);

		return <FactaMainPage setBGImage={setAPImage}>
			{errorPopup}
			<FactaArticleRegion title="Enter your email address and we'll send you a link to access your record." buttons={buttons}>
			To gain access to your record, enter your email address and then we will send you an email with a link to continue.
			You must use the same address you wrote on your application, so if you don't receive an email from us, try a different address
			<br />
			<br />
			If you experience any difficulty please call the Front Office at 617-523-1038, and we would be happy to help get you set up. 
				<table><tbody>
					<FormInput
						id="email"
						label="Email"
						isPassword={false}
						isRequired
						value={self.state.formData.email}
						updateAction={updateState}
						onEnter={submit}
					/>
				</tbody></table>
			</FactaArticleRegion>
		</FactaMainPage>
	}
}