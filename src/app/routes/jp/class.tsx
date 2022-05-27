import * as React from 'react';
import * as t from 'io-ts';
import {jpPathClass} from "app/paths/jp/class";
import PageWrapper from "core/PageWrapper";
import RouteWrapper from "core/RouteWrapper";
import { getWrapper as seeTypesWrapper, validator as seeTypesValidator } from "async/junior/see-types";
import SelectClassType from "containers/jp/class-signup/SelectClassType";
import { getWrapper as getSignups, GetSignupsAPIResult } from 'async/junior/get-signups';
import { setJPImage } from 'util/set-bg-image';
import FactaLoadingPage from 'theme/facta/FactaLoadingPage';
import { Option } from 'fp-ts/lib/Option';
import optionify from 'util/optionify';

export const classPageRoute = new RouteWrapper(true, jpPathClass, history => <PageWrapper
	key="SelectClassType"
	history={history}
	component={(urlProps: {personId: number, successMsg: Option<string>}, [apiResult, signups]: [t.TypeOf<typeof seeTypesValidator>, GetSignupsAPIResult]) => <SelectClassType
		successMsg={urlProps.successMsg}
		personId={urlProps.personId}
		apiResultArray={apiResult}
		history={history}
		signups={signups}
	/>}
	urlProps={{
        personId: Number(jpPathClass.extractURLParams(history.location.pathname).personId),
		successMsg: optionify((new URLSearchParams(history.location.search)).get("msg"))
    }}
	shadowComponent={<FactaLoadingPage setBGImage={setJPImage} />}
	getAsyncProps={(urlProps: {personId: number, successMsg: Option<string>}) => {
		return Promise.all([
			seeTypesWrapper(urlProps.personId).send(null),
			getSignups(urlProps.personId).send(null)
		]).catch(err => Promise.resolve(null));  // TODO: handle failure
	}}
/>);



