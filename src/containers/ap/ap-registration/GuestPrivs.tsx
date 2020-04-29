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

export default class GuestPrivs extends React.Component<Props, {radio: string}> {
	render() {
		const self = this;
		return <JoomlaMainPage setBGImage={setAPImage} navBar={NavBarLogoutOnly({history: this.props.history, sysdate: none, showProgramLink: false})}>
			<JoomlaNotitleRegion>
				{this.props.breadcrumb}
			</JoomlaNotitleRegion>
			<JoomlaArticleRegion title="Guest Privileges">
			Members may elect to add on guest privileges for an additional $25 fee.
            The guest privileges option includes all guests you bring sailing or kayaking for the term of your current membership.
            A member must have the appropriate ratings to use guest privileges: at least a Mercury Yellow rating for sailing and a
            Kayak rating for kayaking. Maximum occupancy rules do apply and vary by vessel.
            For example, up to 3 guests at a time may be taken out sailing on a Cape Cod Mercury sailboat and 1 guest each time out kayaking.<br />
            <br />
            Guest privileges may be purchased at any time during one's membership. Guest privileges are automatically included for full year membership renewals.
			</JoomlaArticleRegion>
			<JoomlaNotitleRegion>
				<RadioGroup
					id="accept"
					label=""
					columns={1}
					values={[{
						key: "Yes",
						display: "I would like to purchase guest privileges for $25."
					}, {
						key: "No",
						display: "I would not like to purchase guest privileges at this time."
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
			{(self.state || {} as any).radio != undefined ? <Button text="Next >" spinnerOnClick onClick={() => 
				self.props.goNext()
			}/> : ""}
		</JoomlaMainPage>
	}
}