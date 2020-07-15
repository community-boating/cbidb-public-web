import * as React from 'react';
import RouteWrapper from "../../../core/RouteWrapper";
import { apPathAddons } from '../../paths/ap/addons';
import AddonsWizard from '../../../containers/ap/AddonsWizard';
import PageWrapper from '../../../core/PageWrapper';
import JoomlaLoadingPage from '../../../theme/joomla/JoomlaLoadingPage';
import { setAPImage } from '../../../util/set-bg-image';
import { apiw as welcomeAPI } from "../../../async/member-welcome-ap";
import { getNoGP, getNoDW } from '../../../containers/ap/HomePageActionsAP';

type AddonsProps = {
	noGP: boolean,
	noDW: boolean
}

export const apAddonsPageRoute = new RouteWrapper(true, apPathAddons, history => <PageWrapper
	key="addons"
	history={history}
	component={(urlProps: {}, async: AddonsProps) => <AddonsWizard
		history={history}
		noGP={async.noGP}
		noDW={async.noDW}
	/>}
	urlProps={{}}
	getAsyncProps={() => {
		return welcomeAPI.send(null).then(res => {
			if (res.type == "Success") {
				return {
					type: "Success",
					success: {
						noGP: getNoGP(res.success.actions),
						noDW: getNoDW(res.success.actions)
					}
				}
			}
		}).catch(err => Promise.resolve(null));  // TODO: handle failure
	}}
	shadowComponent={<JoomlaLoadingPage setBGImage={setAPImage} />}
/>);
