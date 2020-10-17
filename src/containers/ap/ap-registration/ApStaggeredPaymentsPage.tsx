import { none, some } from "fp-ts/lib/Option";
import { History } from "history";
import * as React from "react";

import Button from "../../../components/Button";
import { RadioGroup } from "../../../components/InputGroup";
import JoomlaArticleRegion from "../../../theme/joomla/JoomlaArticleRegion";
import JoomlaMainPage from "../../../theme/joomla/JoomlaMainPage";
import JoomlaNotitleRegion from "../../../theme/joomla/JoomlaNotitleRegion";
import NavBarLogoutOnly from "../../../components/NavBarLogoutOnly";
import { setAPImage } from "../../../util/set-bg-image";

interface Props {
	history: History<any>
	breadcrumb: JSX.Element,
	goNext: () => Promise<void>,
	goPrev: () => Promise<void>
}

export default class ApStaggeredPaymentsPage extends React.Component<Props, {radio: string}> {
	constructor(props: Props) {
		super(props);
		this.state = {
			radio: null
		}
	}
	render() {
		const self = this;
		return <JoomlaMainPage setBGImage={setAPImage} navBar={NavBarLogoutOnly({history: this.props.history, sysdate: none, showProgramLink: false})}>
			<JoomlaNotitleRegion>
				{this.props.breadcrumb}
			</JoomlaNotitleRegion>
			<JoomlaArticleRegion title="Payment in monthly installments is available.">
				Text describing montly payments here.<br />
				<br />
				Payment schedule here.
			</JoomlaArticleRegion>
			<JoomlaNotitleRegion>
				<RadioGroup
					id="accept"
					label=""
					columns={1}
					values={[{
						key: "Yes",
						display: `I elect to pay the full price of my membership today.`
					}, {
						key: "No",
						display: "I want to pay in the installments listed above.  I understand that all payments are non-refundable."
					}]}
					updateAction={(id: string, radio: string) => {
						self.setState({
							radio
						})
					}}
					value={self.state ? some(self.state.radio) : none}
					justElement={true}
				/>
			</JoomlaNotitleRegion>
			<Button text="< Back" onClick={self.props.goPrev}/>
			{(self.state || {} as any).radio != undefined ? <Button text="Next >" spinnerOnClick onClick={() => {
				return self.props.goNext();
				// return submit.send(makePostJSON({
				// 	wantIt: self.state.radio == "Yes"
				// })).then(res => {
				// 	if (res.type == "Success") {
				// 		self.props.goNext()
				// 	} else {
				// 		window.scrollTo(0, 0);
				// 	}
				// })
			}}/> : ""}
		</JoomlaMainPage>
	}
}