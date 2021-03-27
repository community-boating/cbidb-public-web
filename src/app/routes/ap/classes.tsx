import * as React from 'react';
import * as t from 'io-ts';
import {apPathClasses} from "@paths/ap/classes";
import PageWrapper from "@core/PageWrapper";
import RouteWrapper from "@core/RouteWrapper";
import { setAPImage } from '@util/set-bg-image';
import ApClassPage from '@containers/ap/ApClassPage';
import {getWrapper as getTypesWithAvailability, validator as typesValidator} from "@async/member/ap-class-type-avail"
import {getWrapper as getClasses, resultValidator as classesValidator} from "@async/member/ap-classes-for-calendar"
import FactaLoadingPage from '@facta/FactaLoadingPage';


export const apClassesPageRoute = new RouteWrapper(true, apPathClasses, history => <PageWrapper
    key="reg"
    history={history}
    component={(urlProps: {}, async: {types: t.TypeOf<typeof typesValidator>, instances: t.TypeOf<typeof classesValidator>}) => <ApClassPage
		history={history}
		types={async.types}
		instances={async.instances}
    />}
    urlProps={{}}
	shadowComponent={<FactaLoadingPage setBGImage={setAPImage} />}
	getAsyncProps={() => {
		return Promise.all([
			getTypesWithAvailability.send(null),
			getClasses.send(null)
		])
		.then(([types, instances]) => {
			if (types.type == "Success" && instances.type == "Success") {
				return Promise.resolve({
					type: "Success",
					success: {
						types: types.success,
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




