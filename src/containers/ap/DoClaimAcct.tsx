import { Option, none } from 'fp-ts/lib/Option';
import * as React from "react";
import TextInput from '../../components/TextInput';
import formUpdateState from '../../util/form-update-state';
import {JoomlaErrorDiv} from '../../theme/joomla/JoomlaErrorDiv';
import FactaArticleRegion from '../../theme/facta/FactaArticleRegion';
import { setAPImage } from '../../util/set-bg-image';
import {History} from "history"
import JoomlaButton from '../../theme/joomla/JoomlaButton';
import {postWrapper} from "../../async/member/do-claim-acct"
import { PostURLEncoded } from '../../core/APIWrapperUtil';
import { apBasePath } from '../../app/paths/ap/_base';
import asc from '../../app/AppStateContainer';
import Validation from '../../util/Validation';
import FactaMainPage from '../../theme/facta/FactaMainPage';

const defaultForm = {
	pw1: none as Option<string>,
	pw2: none as Option<string>
}

type Form = typeof defaultForm

export type Props = {
	history: History<any>,
	email: string,
	personId: number,
	hash: string
}

type State = {
	formData: Form,
	validationErrors: string[]
}

class FormInput extends TextInput<Form> {}

export default class DoClaimAcct extends React.PureComponent<Props, State> {
	constructor(props: Props) {
		super(props);
		this.state = {
			formData: defaultForm,
			validationErrors: []
		}
	}
	static validate(state: State): string[] {
		const isNotNull = (os: Option<string>) => os.isSome() && os.getOrElse("").length > 0;
	
		const validations = [
			new Validation(isNotNull(state.formData.pw1), "Password must be specified."),
			new Validation(state.formData.pw1.getOrElse("") == state.formData.pw2.getOrElse(""), "Passwords must be equal."),
			new Validation(state.formData.pw1.getOrElse("").length >= 6, "Password must be at least 6 characters long."),
		];
	
		return validations.filter(v => !v.pass).map(v => v.errorString);
	}
	render() {
		const self= this;
		const updateState = formUpdateState(this.state, this.setState.bind(this), "formData");

		const submit = () => {
			const validationResults = DoClaimAcct.validate(this.state);
			if (validationResults.length > 0) {
				self.setState({
					...self.state,
					validationErrors: validationResults
				})
				return Promise.resolve();
			} else {
				return postWrapper.send(PostURLEncoded({
					username: self.props.email,
					personId: self.props.personId,
					hash: self.props.hash,
					password: self.state.formData.pw1.getOrElse("")
				})).then(res => {
					if (res.type == "Success") {
						asc.updateState.login.setLoggedIn(self.props.email)
						self.props.history.push(apBasePath.getPathFromArgs({}))
					} else {
						self.setState({
							...self.state,
							validationErrors: res.message.split("\\n")
						})
					}
					return Promise.resolve();
				})
			}
		}

		const buttons = <div>
			<JoomlaButton text="Submit" spinnerOnClick onClick={submit}/>
		</div>

		const errorPopup = (
			(this.state.validationErrors.length > 0)
			? <JoomlaErrorDiv errors={this.state.validationErrors}/>
			: ""
		);

		return <FactaMainPage setBGImage={setAPImage}>
			{errorPopup}
			<FactaArticleRegion title="Please supply a password for your new account." buttons={buttons}>
				<table><tbody>
					<FormInput
						id="pw1"
						label="New Password"
						isPassword={true}
						isRequired
						value={self.state.formData.pw1}
						updateAction={updateState}
					/>
					<FormInput
						id="pw2"
						label="Confirm Password"
						isPassword={true}
						isRequired
						value={self.state.formData.pw2}
						onEnter={submit}
						updateAction={updateState}
					/>
				</tbody></table>
			</FactaArticleRegion>
		</FactaMainPage>
	}
}