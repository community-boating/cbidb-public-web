import { none, some } from "fp-ts/lib/Option";
import { History } from "history";
import * as React from "react";

import { RadioGroup } from "components/InputGroup";
import FactaArticleRegion from "theme/facta/FactaArticleRegion";
import FactaNotitleRegion from "theme/facta/FactaNotitleRegion";
import {apiw as accept} from "async/member/accept-tos"
import NavBarLogoutOnly from "components/NavBarLogoutOnly";
import { setAPImage } from "util/set-bg-image";
import { makePostJSON } from "core/APIWrapperUtil";
import FactaMainPage from "theme/facta/FactaMainPage";
import FactaButton from "theme/facta/FactaButton";

interface Props {
	history: History<any>
	breadcrumb: JSX.Element,
	goNext: () => Promise<void>,
	goPrev: () => Promise<void>
}
declare var docuSignClick: any;

export default class ApTermsConditions extends React.Component<Props, {radio: string}> {
	render() {
		const self = this;
		return <FactaMainPage setBGImage={setAPImage} navBar={NavBarLogoutOnly({history: this.props.history, sysdate: none, showProgramLink: false})}>
			<FactaNotitleRegion>
				{this.props.breadcrumb}
			</FactaNotitleRegion>
			<FactaArticleRegion title="Terms and Conditions">
				<div id="ds-clickwrap"></div>
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
			<script>
				{
					window.setTimeout(() => {
						docuSignClick.Clickwrap.render({
							environment: 'https://demo.docusign.net',
							accountId: '99776339-0b4e-4941-9740-5e75ffc18c21',
							clickwrapId: '9b56c66c-b1bf-4211-aae3-88972d9e48a4',
							clientUserId: 'cbi-person-1234',
							documentData: {
								// fullName: 'Jon Cole',
								// email: 'jon@community-boating.org',
								// company: 'Company',
								// title: 'Job Title',
								// date: '11/12/22'
							}
						}, '#ds-clickwrap')
					}, 0)
				}
			</script>
		</FactaMainPage>
	}
}