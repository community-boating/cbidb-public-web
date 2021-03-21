import * as React from 'react';
import {History} from 'history';
import PageWrapper from '../../../core/PageWrapper';
import LoginPage from '../../../containers/LoginPage';
import asc from '../../AppStateContainer';
import { PageFlavor } from '../../../components/Page';
import {apiw as getStaticYearly} from "../../../async/static-yearly-data"
import { none, some } from 'fp-ts/lib/Option';
import Currency from '../../../util/Currency';
import { setJPImage, setAPImage, setCheckoutImage } from '../../../util/set-bg-image';
import assertNever from '../../../util/assertNever';
import FactaLoadingPage from '../../../theme/facta/FactaLoadingPage';

export default (flavor: PageFlavor) => (history: History<any>) => <PageWrapper
	key="Loginpage"
	history={history}
	component={(urlProps: {}, async: any) => <LoginPage
		history={history}
		jpPrice={async[0]}
		lastSeason={async[1]}
		doLogin={asc.updateState.login.attemptLogin}
		flavor={flavor}
	/>}
	urlProps={{}}
	shadowComponent={<FactaLoadingPage setBGImage={(function() {
		switch(flavor) {
			case PageFlavor.JP:
				return setJPImage;
			case PageFlavor.AP:
				return setAPImage;
			case PageFlavor.SHARED:
			case PageFlavor.DONATE:
			case PageFlavor.GC:
				return setCheckoutImage;
			default:
				assertNever(flavor);
			}
	}())} />}
	getAsyncProps={(urlProps: {}) => {
		return getStaticYearly.send(null).then(res => {
			if (res.type == "Failure") {
				return Promise.resolve({type: "Success", success: [none, none]})
			} else {
				return Promise.resolve({type: "Success", success: [some(Currency.dollars(res.success.data.rows[0][0])), some(res.success.data.rows[0][1]-1)]})
			}
		});  // TODO: handle failure
	}}
/>
