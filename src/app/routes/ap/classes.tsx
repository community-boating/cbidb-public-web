import * as React from 'react';
import * as t from 'io-ts';
import {apPathClasses} from "app/paths/ap/classes";
import PageWrapper from "core/PageWrapper";
import RouteWrapper from "core/RouteWrapper";
import { setAPImage } from 'util/set-bg-image';
import ApClassPage from 'containers/ap/ApClassPage';
import {getWrapper as getTypesWithAvailability, validator as availabilities} from "async/member/ap-class-type-avail"
import {getWrapper as getClasses, instancesValidator as classesValidator} from "async/member/ap-classes-for-calendar"
import FactaLoadingPage from 'theme/facta/FactaLoadingPage';

import {apiw as welcomeAP, validator as welcomeAPValidator} from "async/member-welcome-ap";

export const apClassesPageRoute = new RouteWrapper(true, apPathClasses, history => <PageWrapper
    key="reg"
    history={history}
    component={(urlProps: {}, async: {availabilities: t.TypeOf<typeof availabilities>, instances: t.TypeOf<typeof classesValidator>, welcomeAP: t.TypeOf<typeof welcomeAPValidator>} ) => <ApClassPage
		history={history}
		availabilities={async.availabilities}
		instances={async.instances}
		welcomeAP={async.welcomeAP}
    />}
    urlProps={{}}
	shadowComponent={<FactaLoadingPage setBGImage={setAPImage} spinner />}
	getAsyncProps={() => {
		return Promise.all([
			getTypesWithAvailability.send(null),
			getClasses.send(null),
			welcomeAP.send(null)
		])
		.then(([availabilities, instances, welcomeAP]) => {
			if (availabilities.type == "Success" && instances.type == "Success" && welcomeAP.type == "Success") {
				return Promise.resolve({
					type: "Success",
					success: {
						availabilities: availabilities.success,
						instances: instances.success,
						welcomeAP: welcomeAP.success
					}
				})
			} else {
				return Promise.reject()
			}
		})
		.catch(err => Promise.resolve(null));  // TODO: handle failure
	}}
/>);




