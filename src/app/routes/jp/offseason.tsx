import * as React from 'react';
import * as t from 'io-ts';
import {jpPathOffseason} from "../../paths/jp/offseason";
import PageWrapper from "../../../core/PageWrapper";
import RouteWrapper from "../../../core/RouteWrapper";
import { apiw as welcomeAPI, validator as welcomeValidator } from "../../../async/member-welcome-jp";
import OffseasonClassesStandalone from '../../../containers/jp/OffseasonClassesStandalone';
import Currency from '../../../util/Currency';
import {getWrapper as getOffseasonClasses, validator as offseasonClassesValidator} from "../../../async/junior/offseason-classes"
import { setJPImage } from '../../../util/set-bg-image';
import FactaLoadingPage from '../../../theme/facta/FactaLoadingPage';

type CombinedApiResult = {
	welcome: t.TypeOf<typeof welcomeValidator>,
	offseasonClasses: t.TypeOf<typeof offseasonClassesValidator>
}

export const offseasonPageRoute = new RouteWrapper(true, jpPathOffseason, history => <PageWrapper
	key="OffseasonPage"
	history={history}
	component={(urlProps: {personId: number}, async: CombinedApiResult) => <OffseasonClassesStandalone
		history={history}
		personId={urlProps.personId}
		currentSeason={async.welcome.season}
		offseasonPriceBase={Currency.dollars(async.welcome.jpOffseasonPriceBase)}
		offseasonClasses={async.offseasonClasses}
	/>}
	urlProps={{personId: Number(jpPathOffseason.extractURLParams(history.location.pathname).personId)}}
	shadowComponent={<FactaLoadingPage setBGImage={setJPImage} />}
	getAsyncProps={(urlProps: {personId: number}) => {
		return Promise.all([
			getOffseasonClasses(urlProps.personId).send(null),
			welcomeAPI.send(null)
		]).then(([offseasonClasses, welcome]) => {
			if (welcome.type == "Success" && offseasonClasses.type == "Success") {
				return Promise.resolve({
					type: "Success",
					success: {
						welcome: welcome.success,
						offseasonClasses: offseasonClasses.success
					}
				})
			} else return Promise.resolve(null);
		}).catch(err => Promise.resolve(null));
	}}
/>);
