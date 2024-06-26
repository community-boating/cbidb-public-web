import * as React from 'react';
import * as t from 'io-ts';
import PageWrapper from "core/PageWrapper";
import RouteWrapper from "core/RouteWrapper";
import { setAPImage } from 'util/set-bg-image';
import {getWrapper as getTypesWithAvailability, validator as availabilities} from "async/member/ap-class-type-avail"
import {getWrapper as getClasses, instancesValidator as classesValidator} from "async/member/ap-classes-for-calendar"
import FactaLoadingPage from 'theme/facta/FactaLoadingPage';
import { apPathClassesTeach } from 'app/paths/ap/classes-teach';
import { ApVolunteerClassPage } from 'containers/ap/ApVolunteerClassPage';
import { apiw as welcomeAPIAP, validator as welcomeValidatorAP } from "async/member-welcome-ap";
import {getWrapper as getInstructorInfo, ApClassInstanceInstructorInfo} from "async/member/ap-class-instances-instructor-info";


export const apClassesTeachPageRoute = new RouteWrapper(true, apPathClassesTeach, history => <PageWrapper
    key="classesteach"
    history={history}
    component={(urlProps: {}, async: {
		availabilities: t.TypeOf<typeof availabilities>,
		classesResult: t.TypeOf<typeof classesValidator>,
		welcomeData: t.TypeOf<typeof welcomeValidatorAP>,
		instructorInfo: ApClassInstanceInstructorInfo[]
	}) => <ApVolunteerClassPage
		history={history}
		availabilities={async.availabilities}
		instances={async.classesResult}
		welcomeData={async.welcomeData}
		instructorInfo={async.instructorInfo}
    />}
    urlProps={{}}
	shadowComponent={<FactaLoadingPage setBGImage={setAPImage}>
		<div style={{textAlign: "center"}}>
			<img src="/images/spinner-grey.gif" />
		</div>
	</FactaLoadingPage>}
	getAsyncProps={() => {
		return Promise.all([
			getTypesWithAvailability.send(null),
			getClasses.send(null),
			welcomeAPIAP.send(null),
			getInstructorInfo.send(null)
		])
		.then(([availabilities, instances, welcomeData, instructorInfo]) => {
			if (availabilities.type == "Success" && instances.type == "Success" && welcomeData.type == "Success" && instructorInfo.type == "Success") {
				return Promise.resolve({
					type: "Success",
					success: {
						availabilities: availabilities.success,
						classesResult: instances.success,
						welcomeData: welcomeData.success,
						instructorInfo: instructorInfo.success
					}
				})
			} else {
				return Promise.reject()
			}
		})
		.catch(err => Promise.resolve(null));  // TODO: handle failure
	}}
/>);




