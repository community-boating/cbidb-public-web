import * as React from 'react';
import PageWrapper from "core/PageWrapper";
import RouteWrapper from "core/RouteWrapper";
import { setCheckoutImage } from 'util/set-bg-image';
import DonateWizard from 'containers/donate/DonateWizard';
import { donatePath } from 'app/paths/donate';
import FactaLoadingPage from 'theme/facta/FactaLoadingPage';
import { none, Option, some } from 'fp-ts/lib/Option';

export const donatePageRoute = new RouteWrapper(false, donatePath, history => <PageWrapper
	key="donate"
	history={history}
	component={(urlProps: {fundCode: Option<string>}) => <DonateWizard
		history={history}
		fundCode={urlProps.fundCode}
	/>}
	urlProps={(function() {
		const search = history.location.search;
		const usp = new URLSearchParams(search)
		const fund = usp.get("fund");
		return {
			fundCode: (fund == null ? none : some(fund))
		};
	}())}
	shadowComponent={<FactaLoadingPage setBGImage={setCheckoutImage} />}
/>);