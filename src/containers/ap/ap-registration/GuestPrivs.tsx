import { none, some } from "fp-ts/lib/Option";
import { History } from "history";
import * as React from "react";
import * as t from 'io-ts';

import FactaButton from "../../../theme/facta/FactaButton";
import { RadioGroup } from "../../../components/InputGroup";
import FactaArticleRegion from "../../../theme/facta/FactaArticleRegion";
import JoomlaNotitleRegion from "../../../theme/joomla/JoomlaNotitleRegion";
import NavBarLogoutOnly from "../../../components/NavBarLogoutOnly";
import { setAPImage } from "../../../util/set-bg-image";
import {postWrapper as submit} from "../../../async/member/select-guest-privs"
import { makePostJSON } from "../../../core/APIWrapperUtil";
import {validator as pricesValidator} from "../../../async/prices"
import Currency from "../../../util/Currency";
import FactaMainPage from "../../../theme/facta/FactaMainPage";

interface Props {
	prices: t.TypeOf<typeof pricesValidator>,
	selected: boolean,
	history: History<any>
	breadcrumb: JSX.Element,
	goNext: () => Promise<void>,
	goPrev: () => Promise<void>
}

export default class GuestPrivs extends React.Component<Props, {radio: string}> {
	constructor(props: Props) {
		super(props);
		this.state = {
			radio: props.selected ? "Yes" : null
		}
	}
	render() {
		const self = this;
		return <FactaMainPage setBGImage={setAPImage} navBar={NavBarLogoutOnly({history: this.props.history, sysdate: none, showProgramLink: false})}>
			<JoomlaNotitleRegion>
				{this.props.breadcrumb}
			</JoomlaNotitleRegion>
			<FactaArticleRegion title="Guest Privileges">
			Members may elect to add on guest privileges for an additional {Currency.dollars(this.props.prices.guestPrivsPrice).format(true)} fee.
            The guest privileges option includes all guests you bring sailing or kayaking for the term of your current membership.
            A member must have the appropriate ratings to use guest privileges: at least a Mercury Yellow rating for sailing and a
            Kayak rating for kayaking. Maximum occupancy rules do apply and vary by vessel.
            For example, up to 3 guests at a time may be taken out sailing on a Cape Cod Mercury sailboat and 1 guest each time out kayaking.<br />
            <br />
            Guest privileges may be purchased at any time during one's membership. Guest privileges are automatically included for full year membership renewals.
			</FactaArticleRegion>
			<JoomlaNotitleRegion>
				<RadioGroup
					id="accept"
					label=""
					columns={1}
					values={[{
						key: "Yes",
						display: `I would like to purchase guest privileges for ${Currency.dollars(this.props.prices.guestPrivsPrice).format(true)}.`
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
			<FactaButton text="< Back" onClick={self.props.goPrev}/>
			{(self.state || {} as any).radio != undefined ? <FactaButton text="Next >" spinnerOnClick onClick={() => {
				return submit.send(makePostJSON({
					wantIt: self.state.radio == "Yes"
				})).then(res => {
					if (res.type == "Success") {
						self.props.goNext()
					} else {
						window.scrollTo(0, 0);
						// self.setState({
						// 	...self.state,
						// 	validationErrors: res.message.split("\\n") // TODO
						// });
					}
				})
			}}/> : ""}
		</FactaMainPage>
	}
}