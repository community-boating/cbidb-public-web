import * as React from 'react';
import * as t from 'io-ts';
import PageWrapper from "core/PageWrapper";
import RouteWrapper from "core/RouteWrapper";
import { setAPImage } from 'util/set-bg-image';
import {getWrapper as getTypesWithAvailability, validator as availabilities} from "async/member/ap-class-type-avail"
import {getWrapper as getClasses, resultValidator as classesValidator} from "async/member/ap-classes-for-calendar"
import FactaLoadingPage from 'theme/facta/FactaLoadingPage';
import { apPathClassesTeach } from 'app/paths/ap/classes-teach';
import { ApVolunteerClassPage } from 'containers/ap/ApVolunteerClassPage';
import { apiw as welcomeAPIAP, validator as welcomeValidatorAP } from "async/member-welcome-ap";


export const apClassesTeachPageRoute = new RouteWrapper(true, apPathClassesTeach, history => <PageWrapper
    key="classesteach"
    history={history}
    component={(urlProps: {}, async: {
		availabilities: t.TypeOf<typeof availabilities>,
		instances: t.TypeOf<typeof classesValidator>,
		welcomeData: t.TypeOf<typeof welcomeValidatorAP>,
	}) => <ApVolunteerClassPage
		history={history}
		availabilities={async.availabilities}
		instances={async.instances}
		welcomeData={async.welcomeData}
    />}
    urlProps={{}}
	shadowComponent={<FactaLoadingPage setBGImage={setAPImage} />}
	getAsyncProps={() => {
		return Promise.all([
			getTypesWithAvailability.send(null),
			getClasses.send(null),
			welcomeAPIAP.send(null)
		])
		.then(([availabilities, instances]) => {
			if (availabilities.type == "Success" && instances.type == "Success") {
				return Promise.resolve({
					type: "Success",
					success: {
						availabilities: availabilities.success,
						instances: instances.success
					}
				})
			} else {
				return Promise.reject()
			}
		})
		.catch(err => Promise.resolve(null));  // TODO: handle failure
	}}
/>);




