import * as React from 'react';
import * as t from 'io-ts';
import {jpPathClass} from "@paths/jp/class";
import PageWrapper from "@core/PageWrapper";
import RouteWrapper from "@core/RouteWrapper";
import { getWrapper as seeTypesWrapper, validator as seeTypesValidator } from "@async/junior/see-types";
import SelectClassType from "@containers/jp/class-signup/SelectClassType";
import { getWrapper as getSignups, GetSignupsAPIResult } from '@async/junior/get-signups';
import { setJPImage } from '@util/set-bg-image';
import FactaLoadingPage from '@facta/FactaLoadingPage';

export const classPageRoute = new RouteWrapper(true, jpPathClass, history => <PageWrapper
	key="SelectClassType"
	history={history}
	component={(urlProps: {personId: number}, [apiResult, signups]: [t.TypeOf<typeof seeTypesValidator>, GetSignupsAPIResult]) => <SelectClassType
		personId={urlProps.personId}
		apiResultArray={apiResult}
		history={history}
		signups={signups}
	/>}
	urlProps={{
        personId: Number(jpPathClass.extractURLParams(history.location.pathname).personId),
    }}
	shadowComponent={<FactaLoadingPage setBGImage={setJPImage} />}
	getAsyncProps={(urlProps: {personId: number}) => {
		return Promise.all([
			seeTypesWrapper(urlProps.personId).send(null),
			getSignups(urlProps.personId).send(null)
		]).catch(err => Promise.resolve(null));  // TODO: handle failure
	}}
/>);



