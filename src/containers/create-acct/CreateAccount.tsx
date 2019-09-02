import { Option } from 'fp-ts/lib/Option';
import * as React from "react";
import TextInput from "../../components/TextInput";
import JoomlaMainPage from '../../theme/joomla/JoomlaMainPage';


export const formName = "create-acct"

export interface Form {
	firstName: Option<string>
	lastName: Option<string>
	email: Option<string>
	pw1: Option<string>
	pw2: Option<string>
}

interface StateProps {
	//form: Option<Form>
}

interface DispatchProps {
	// updateField: (name: string, value: string) => void,
	// cancel: () => void
}

interface StaticProps {

}

type Props = StateProps & DispatchProps & StaticProps


class FormInput extends TextInput<Form> {}

export default class CreateAccount extends React.PureComponent<Props> {
	constructor(props: Props) {
		super(props);
	}
	render() {
		// const self= this;

		// const buttons = <div>
		// 	<Button text="< Cancel" onClick={this.props.cancel}/>
		// 	<Button text="Register" onClick={placeholderAction}/>
		// </div>
		// const main = <JoomlaArticleRegion title="First let's make you a parent account." buttons={buttons}>
		// 	<table><tbody>
		// 		<FormInput
		// 			id="firstName"
		// 			label="Parent First Name"
		// 			isPassword={false}
		// 			value={self.props.form.getOrElse({} as any).firstName}
		// 			updateAction={self.props.updateField}
		// 		/>
		// 		<FormInput
		// 			id="lastName"
		// 			label="Parent Last Name"
		// 			isPassword={false}
		// 			value={self.props.form.getOrElse({} as any).lastName}
		// 			updateAction={self.props.updateField}
		// 		/>
		// 		<FormInput
		// 			id="email"
		// 			label="Parent Email"
		// 			isPassword={false}
		// 			value={self.props.form.getOrElse({} as any).email}
		// 			updateAction={self.props.updateField}
		// 		/>
		// 		<FormInput
		// 			id="pw1"
		// 			label="Create Password"
		// 			isPassword={true}
		// 			value={self.props.form.getOrElse({} as any).pw1}
		// 			updateAction={self.props.updateField}
		// 		/>
		// 		<FormInput
		// 			id="pw2"
		// 			label="Confirm Password"
		// 			isPassword={true}
		// 			value={self.props.form.getOrElse({} as any).pw2}
		// 			updateAction={self.props.updateField}
		// 		/>
		// 	</tbody></table>
		// </JoomlaArticleRegion>

		// const sidebar = <JoomlaSidebarRegion title="INFO">
		// 	<div>
		// 		Please supply an email address and password for your online account. Your account will allow you to register child(ren) for classes, renew their memberships, and sign them up for special Junior Program events.<br />
		// 		<br />
		// 		If you start the registration process and don't complete it, you can use this email/password to continue from where you left off.
		// 	</div>
		// </JoomlaSidebarRegion>
		// return <Joomla8_4 main={main} right={sidebar} />
		return <JoomlaMainPage></JoomlaMainPage>
	}
}
/*
export default connect<StateProps, DispatchProps, StaticProps>(
	state => ({
		//form: state.createAcctForm.data
	}),
	dispatch => ({
		updateField: (name: keyof Form, value: string) => {},
		cancel: () => dispatch(push('/'))
	})
)(CreateAccount)*/