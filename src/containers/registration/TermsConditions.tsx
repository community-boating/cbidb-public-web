import { none, some } from "fp-ts/lib/Option";
import { History } from "history";
import * as React from "react";

import Button from "../../components/Button";
import { RadioGroup } from "../../components/InputGroup";
import JoomlaArticleRegion from "../../theme/joomla/JoomlaArticleRegion";
import JoomlaMainPage from "../../theme/joomla/JoomlaMainPage";
import JoomlaNotitleRegion from "../../theme/joomla/JoomlaNotitleRegion";

interface Props {
	history: History<any>
	breadcrumb: JSX.Element,
	goNext: () => void,
	goPrev: () => void
}

export default class TermsConditions extends React.Component<Props, {radio: string}> {
	render() {
		const self = this;
		return <JoomlaMainPage>
			<JoomlaNotitleRegion>
				{this.props.breadcrumb}
			</JoomlaNotitleRegion>
			<JoomlaArticleRegion title="Terms and Conditions">
			I understand that participation in sailing and other boating activities, both on the water and on-shore, may pose risks to my child's health and safety. I have read and understand the rules and regulations established by Community Boating, Inc. and agree to be bound by them. My approval of my child's participation in the Community Boating, Inc. program is made in full recognition and assumption of those risks and is entirely voluntary. In consideration of your admission of my child into Junior Program membership, I hereby agree, for myself, executors, administrators and assigns, to release and hold harmless Community Boating, Inc., its directors, officers, members, employees, representatives, successors and assigns, from any and all claims, liability or loss arising from any injury or damage to my child's health, well-being or property during participation in this program.
			<br /><br />
			I am aware of and familiar with the risks and dangers involved with the type of vessels and activities in which my child will be involved. I have read and understand the posted rules and regulations for participation and agree to abide by all of them. I have read and understand the above and sign this of my own free will and desire.
			<br /><br />
			I hereby grant permission to CBI or assigns ("Photographer") the irrevocable right and unrestricted permission with respect to photographic images of my child at CBI, on boats or docks, or in which my child may be included with others, to use and/or publish individually or in conjunction with any printed matter, in any and all media, and for any legal purpose whatsoever, including, but not limited to illustration, promotion, exhibition, publication, advertising and trade. Furthermore, I consider CBI the sole and complete owner of any such photographs. I warrant I have the right to authorize these uses and hereby agree to hold CBI harmless of any and all liability in perpetuity.
			<br /><br />
			<span style={{fontWeight: "bold"}}>I understand that any CBI membership is non-transferable and non-refundable.</span>
			</JoomlaArticleRegion>
			<JoomlaNotitleRegion>
				<RadioGroup
					id="accept"
					label=""
					columns={1}
					values={[{
						key: "No",
						display: "I do not accept."
					}, {
						key: "Yes",
						display: "I accept."
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
			{(self.state || {} as any).radio == "Yes" ? <Button text="Next >" onClick={self.props.goNext}/> : ""}
		</JoomlaMainPage>
	}
}