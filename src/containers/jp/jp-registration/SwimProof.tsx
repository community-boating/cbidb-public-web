import { Option, none } from "fp-ts/lib/Option";
import * as React from "react";
import { History } from 'history';

import { postWrapper } from "@async/junior/swim-proof";
import FactaButton from "@facta/FactaButton";
import { RadioGroup } from "@components/InputGroup";
import { makePostJSON } from "@core/APIWrapperUtil";
import swimProofValues from "@lov/swimProof";
import FactaArticleRegion from "@facta/FactaArticleRegion";
import FactaNotitleRegion from "@facta/FactaNotitleRegion";
import formUpdateState from "@util/form-update-state";
import NavBarLogoutOnly from "@components/NavBarLogoutOnly";
import { setJPImage } from "@util/set-bg-image";
import FactaMainPage from "@facta/FactaMainPage";

export interface Form {
	swimProofId: Option<string>
}

class FormRadio extends RadioGroup<Form> {}


type Props = {
	personId: number,
	history: History<any>,
	goNext: () => Promise<void>,
	goPrev: () => Promise<void>,
	breadcrumb: JSX.Element,
	initialFormData: Form,
}

interface State {
	formData: Form
}

export default class SwimProof extends React.Component<Props, State> {
	constructor(props: Props) {
		super(props);
		this.state = {
			formData: props.initialFormData
		}
	}
	render() {
		const self = this;
		const updateState = formUpdateState(this.state, this.setState.bind(this), "formData");
        
        const bodyText = `All juniors are required to be able to swim 50 yards, and parents are required to possess a written proof of their child's swimming ability.
                    You do not need to present this proof unless asked by Community Boating, however failure to present acceptable proof upon request
                     may result in suspension of membership until adequate proof can be obtained.`



        const noProofRegion = (<FactaNotitleRegion>
            <div style={({padding: "8px 50px", border: "1px solid #999", margin: "0px 30px"})}>
                Getting written proof of swimming ability is easy and can be done at any YMCA or local pool.   <a href="http://www.ymcaboston.org/find-your-y" target="_blank">Click here</a> to
                find your local YMCA.
                You can schedule your test by appointment for $5 or less. Simply let the Y know that your child needs to be tested to swim 50 yards without stopping,
                and that you require a signed letter at the completion of your test. Taking the test at the Y will give you the "written proof of swimming
                ability on Pool Letterhead" swim proof option for your child.
            </div>
        </FactaNotitleRegion>)
	
		return <FactaMainPage setBGImage={setJPImage} navBar={NavBarLogoutOnly({history: this.props.history, sysdate: none, showProgramLink: false})}>
			<FactaNotitleRegion>
				{this.props.breadcrumb}
			</FactaNotitleRegion>
			<FactaArticleRegion title="Please select your form of swim proof.">
                {bodyText}
                <br /><br />
                {"Which of these do you possess?"}
                <br /><br />
                <FormRadio
					id="swimProofId"
					justElement={true}
					values={swimProofValues}
					updateAction={updateState}
					value={this.state.formData.swimProofId}
				/>
			</FactaArticleRegion>
            {this.state.formData.swimProofId.getOrElse(null) == "-1" ? noProofRegion : ""}
            <FactaNotitleRegion>
                <span>
                If you believe you have a proof of swimming ability not on the above list,
                <br />
				please contact Fiona O'Connor, Junior Program Director, 
				at <a href="mailto:fiona@community-boating.org">fiona@community-boating.org</a>.
                </span>
			</FactaNotitleRegion>
			<FactaButton text="< Back" onClick={this.props.goPrev}/>
			{self.state.formData.swimProofId.getOrElse("-1") != "-1" ? <FactaButton text="Next >" spinnerOnClick onClick={() => {
				return postWrapper(this.props.personId).send(makePostJSON({swimProofId: this.state.formData.swimProofId} ))
					.then(this.props.goNext)
			}}/> : null}
			
		</FactaMainPage>
	}
}
