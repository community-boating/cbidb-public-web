import * as React from "react";
import FactaButton from '@facta/FactaButton';
import FactaArticleRegion from '@facta/FactaArticleRegion';
import { setAPImage, setJPImage } from '@util/set-bg-image';
import {History} from "history"
import { Option, some, none } from "fp-ts/lib/Option";
import * as t from 'io-ts';
// import asc from "@app/AppStateContainer";
// import TextInput from "@components/TextInput";
import formUpdateState from "@util/form-update-state";
import { apBasePath } from "@paths/ap/_base";
import {FactaErrorDiv} from "@facta/FactaErrorDiv";
import { makePostJSON } from "@core/APIWrapperUtil";
import FactaMainPage from "@facta/FactaMainPage";
import { PageFlavor } from "@components/Page";
import { jpBasePath } from "@paths/jp/_base";
import { CheckboxGroup } from "@components/InputGroup";
import { getWrapper as getMemberAlerts, postWrapper as postMemberAlerts } from "@async/member/alerts";
// import notificationMethods from "@lov/notificationMethods";
import alertFlagColors from "@lov/alertFlagColors";
import { validator as flagNotificationsValidator } from '@async/member/alerts';



type Form = {
	'email': Option<string[]>
}

const emptyForm = () : Form => {
	return {
		email: some([])
	};
}

type Props = {
	history: History<any>,
	pageFlavor: PageFlavor,
	initialNotificationSettings: t.TypeOf<typeof flagNotificationsValidator>
}

type State = {
	formData: Form,
	validationErrors: string[]
}

class FormCheckbox extends CheckboxGroup<Form>{}

export default class FlagNotificationsPage extends React.PureComponent<Props, State> {
	constructor(props: Props) {
		super(props);
		
		this.state = {
			formData: this.serialize(this.props.initialNotificationSettings),
			validationErrors: []
		}
	}

	serialize(payload: t.TypeOf<typeof flagNotificationsValidator>) : Form {
		let result = emptyForm();
		if (payload["yellowAp"].email) {
			result.email.getOrElse([]).push('Yellow');
		}
		if (payload["redAp"].email) {
			result.email.getOrElse([]).push('Red');
		}
		return result;
	}

	deserialize(form: Form): t.TypeOf<typeof flagNotificationsValidator> {
		let result = {
			'yellowAp': {
				'email': form.email.getOrElse([]).contains('Yellow')
			},
			'redAp': {
				'email': form.email.getOrElse([]).contains('Red')
			}
		};
		return result;
	}
	
	render() {
		const self = this;
		getMemberAlerts;

		const updateState = formUpdateState(this.state, this.setState.bind(this), "formData");

		const returnRoute = (
			this.props.pageFlavor == PageFlavor.JP
			? jpBasePath.getPathFromArgs({})
			: apBasePath.getPathFromArgs({})
		);

		const doClear = () => {
			self.setState({
				...self.state,
				formData: emptyForm()
			});
		}

		const doSubmit = () => {
			let payload = this.deserialize(this.state.formData)
			return postMemberAlerts.send(makePostJSON(payload)).then(ret => {
				if (ret.type == "Success") {
					// const email = self.state.formData.email.getOrElse("");
					// if (email.length > 0) {
					// 	asc.updateState.login.setLoggedIn(email);
					// } XXX we may need to have code here to actually preserve updated checkboxes
					self.props.history.push(returnRoute);
				} else {
					window.scrollTo(0, 0);
					self.setState({
						...self.state,
						validationErrors: ret.message.split("\\n") // TODO
					});
				}
			});
		}

		const buttons = <div>
			<FactaButton text="< Cancel" onClick={() => Promise.resolve(this.props.history.push(returnRoute))}/>
			<FactaButton text="Unsubscribe From All" onClick={() => Promise.resolve(doClear()).then(() => doSubmit())} spinnerOnClick/>
			<FactaButton text="Submit" onClick={doSubmit} spinnerOnClick/>
		</div>

		const errorPopup = (
			(this.state.validationErrors.length > 0)
			? <FactaErrorDiv errors={this.state.validationErrors}/>
			: ""
		);

		const setBgImage = (
			this.props.pageFlavor == PageFlavor.JP
			? setJPImage
			: setAPImage
		);

		return <FactaMainPage setBGImage={setBgImage}>
		{errorPopup}
			<FactaArticleRegion title="Edit Flag Notifications" buttons={buttons}>
				Community Boating can send you a notification through the methods below 
				whenever our flag changes color to yellow or red. Note that flag colors 
				are subject to change at any time and that a flag notification does not 
				guarantee that the flag will remain the same color.
				<br/> <br/>
				This feature is completely opt-in. To unsubscribe from all notifications,
				click "Unsubscribe From All". Otherwise, after editing your notification
				settings, click "Submit" to save your changes.
				<br/><br/>
				<table><tbody>
					<FormCheckbox
						id="email"
						label="Email Notifications:"
						columns={2}
						values={alertFlagColors}
						updateAction={(id: string, value: string) => {
								updateState(id, value);
							}}
						value={this.state.formData.email || none}
					/>
					{/* Add checkboxes for new notification methods here (e.g. SMS) */}
				</tbody></table>
			</FactaArticleRegion>
		</FactaMainPage>
	}
}
