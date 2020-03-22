import { History } from 'history';
import * as React from "react";

import Button from "../components/Button";
import JoomlaArticleRegion from "../theme/joomla/JoomlaArticleRegion";
import JoomlaMainPage from "../theme/joomla/JoomlaMainPage";
import TextInput from '../components/TextInput';
import { Option, none } from 'fp-ts/lib/Option';
import formUpdateState from '../util/form-update-state';
import { setJPImage } from '../util/set-bg-image';

export interface Props {
	history: History<any>
}

const defaultForm = {
	firstName: none as Option<string>,
	lastName: none as Option<string>,
	email: none as Option<string>,
	oldPw: none as Option<string>,
	newPw1: none as Option<string>,
	newPw2: none as Option<string>
}

type Form = typeof defaultForm;

type State = {
	formData: Form
}

class FormInput extends TextInput<Form> {}

export default class AccountSettingsPage extends React.PureComponent<Props, State> {
	constructor(props: Props) {
		super(props);
		this.state = {
			formData: defaultForm
		};
	}
	render() {
		const formData = this.state.formData
		const updateState = formUpdateState(this.state, this.setState.bind(this), "formData");

		return <JoomlaMainPage setBGImage={setJPImage}>
			<JoomlaArticleRegion title="Edit Account Info">
				<table><tbody>
					<FormInput
						id="firstName"
						label="First Name"
						isRequired={true}
						value={formData.firstName}
						updateAction={updateState}
					/>
					<FormInput
						id="lastName"
						label="Last Name"
						isRequired={true}
						value={formData.lastName}
						updateAction={updateState}
					/>
					<FormInput
						id="email"
						label="Email"
						isRequired={true}
						value={formData.email}
						updateAction={updateState}
					/>
					<FormInput
						id="oldPw"
						label="Old Password"
						value={formData.oldPw}
						updateAction={updateState}
					/>
					<FormInput
						id="newPw1"
						label="Change Password"
						value={formData.newPw1}
						updateAction={updateState}
					/>
					<FormInput
						id="newPw2"
						label="Confirm Password"
						value={formData.newPw2}
						updateAction={updateState}
					/>
				</tbody></table>
			</JoomlaArticleRegion>
			{/* <p>
				<PlaceholderLink style={{fontSize: "1.3em"}}>Click here to (re-)apply for a Junior Program Scholarship (changes on this page will not be saved)</PlaceholderLink>
			</p> */}
			<Button text="Cancel" onClick={() => Promise.resolve(this.props.history.push("/"))}/>
		</JoomlaMainPage>
	}
}
