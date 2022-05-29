import { none, some } from "fp-ts/lib/Option";
import { History } from "history";
import * as React from "react";
import * as t from 'io-ts';

import { RadioGroup } from "components/InputGroup";
import FactaArticleRegion from "theme/facta/FactaArticleRegion";
import FactaNotitleRegion from "theme/facta/FactaNotitleRegion";
import NavBarLogoutOnly from "components/NavBarLogoutOnly";
import { setAPImage } from "util/set-bg-image";
import {postWrapper as submit} from "async/member/select-damage-waiver"
import { makePostJSON } from "core/APIWrapperUtil";
import {validator as pricesValidator} from "async/prices"
import Currency from "util/Currency";
import FactaMainPage from "theme/facta/FactaMainPage";
import FactaButton from "theme/facta/FactaButton";

interface Props {
	prices: t.TypeOf<typeof pricesValidator>,
	selected: boolean,
	history: History<any>
	breadcrumb: JSX.Element,
	goNext: () => Promise<void>,
	goPrev: () => Promise<void>
}

export default class DamageWaiver extends React.Component<Props, {radio: string}> {
	constructor(props: Props) {
		super(props);
		this.state = {
			radio: props.selected ? "Yes" : null
		}
	}
	render() {
		const self = this;
		return <FactaMainPage setBGImage={setAPImage} navBar={NavBarLogoutOnly({history: this.props.history, sysdate: none, showProgramLink: false})}>
			<FactaNotitleRegion>
				{this.props.breadcrumb}
			</FactaNotitleRegion>
			<FactaArticleRegion title="Consider purchasing an Accidental Damage Waiver.">
			Any member who signs out a boat, including windsurfers and kayaks, shall be held financially responsible for damage to that boat and its equipment,
			and damage to any other boat, windsurfer, or equipment in the event of a collision.
			A member shall forfeit all membership privileges until satisfactory arrangements for payment of the cost of repairs is made with the Executive Director.
			Members may elect to purchase an annual damage liability waiver for a fee of {Currency.dollars(this.props.prices.damageWaiverPrice).format(true)}.
			This waiver covers any accidental damages to boats, but does not cover gross negligence, recklessness, or intentional acts.
			Declining the waiver signifies that a member agrees to pay for the cost of repairs, as determined by Community Boating Inc., up to a maximum of $5000.
			</FactaArticleRegion>
			<FactaNotitleRegion>
				<RadioGroup
					id="accept"
					label=""
					columns={1}
					values={[{
						key: "Yes",
						display: `I elect to purchase the damage waiver for ${Currency.dollars(this.props.prices.damageWaiverPrice).format(true)}.`
					}, {
						key: "No",
						display: "I decline to purchase the damage waiver. I acknowledge that I may be held financially responsible for damages incurred to boats or equipment."
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