import { none, some } from "fp-ts/lib/Option";
import { History } from "history";
import * as React from "react";

import { RadioGroup } from "@components/InputGroup";
import FactaArticleRegion from "@facta/FactaArticleRegion";
import FactaNotitleRegion from "@facta/FactaNotitleRegion";
import {apiw as accept} from "@async/member/accept-tos"
import NavBarLogoutOnly from "@components/NavBarLogoutOnly";
import { setAPImage } from "@util/set-bg-image";
import { makePostJSON } from "@core/APIWrapperUtil";
import FactaMainPage from "@facta/FactaMainPage";
import FactaButton from "@facta/FactaButton";

interface Props {
	history: History<any>
	breadcrumb: JSX.Element,
	goNext: () => Promise<void>,
	goPrev: () => Promise<void>
}

export default class ApTermsConditions extends React.Component<Props, {radio: string}> {
	render() {
		const self = this;
		return <FactaMainPage setBGImage={setAPImage} navBar={NavBarLogoutOnly({history: this.props.history, sysdate: none, showProgramLink: false})}>
			<FactaNotitleRegion>
				{this.props.breadcrumb}
			</FactaNotitleRegion>
			<FactaArticleRegion title="Terms and Conditions">
			I understand that participation in sailing and other boating activities, both on the water and on-shore, may pose risks to my health and safety. I have read and understand the rules and regulations established by Community Boating, Inc. and agree to be bound by them. My decision to participate in the Community Boating, Inc. program is made in full recognition and assumption of those risks and is entirely voluntary. In consideration of your acceptance of this application, I hereby agree, for myself, executors, administrators and assigns, to release and hold harmless Community Boating, Inc., its directors, officers, members, employees, representatives, successors and assigns, from any and all claims, liability or loss arising from any injury or damage to my health, well-being or property during participation in this program.
			<br /><br />
			I am aware of and familiar with the risks and dangers involved with the type of vessels and activities in which I will be involved. I have read and understand the posted rules and regulations for participation and agree to abide by all of them.
			<br /><br />
			I hereby grant permission to CBI or assigns ("Photographer") the irrevocable right and unrestricted permission with respect to photographic images of myself at CBI, on boats or docks, or in which I may be included with others, to use and/or publish individually or in conjunction with any printed matter, in any and all media, and for any legal purpose whatsoever, including, but not limited to illustration, promotion, exhibition, publication, advertising and trade. Furthermore, I consider CBI the sole and complete owner of any such photographs. I warrant I have the right to authorize these uses and hereby agree to hold CBI harmless of any and all liability in perpetuity.
			<br /><br />
			<span style={{fontWeight: "bold"}}>I understand that any CBI membership is non-transferable and non-refundable.</span>
			</FactaArticleRegion>
			<FactaNotitleRegion>
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
			</FactaNotitleRegion>
			<FactaButton text="< Back" onClick={self.props.goPrev}/>
			{(self.state || {} as any).radio == "Yes" ? <FactaButton text="Next >" spinnerOnClick onClick={() => 
				accept.send(makePostJSON({})).then(self.props.goNext)
			}/> : ""}
		</FactaMainPage>
	}
}