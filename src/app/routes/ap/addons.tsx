import * as React from 'react';
import RouteWrapper from "core/RouteWrapper";
import { apPathAddons } from 'app/paths/ap/addons';
import AddonsWizard from 'containers/ap/AddonsWizard';
import PageWrapper from 'core/PageWrapper';
import { setAPImage } from 'util/set-bg-image';
import { apiw as welcomeAPI } from "async/member-welcome-ap";
import { getNoGP, getNoDW } from 'containers/ap/HomePageActionsAP';
import { apBasePath } from 'app/paths/ap/_base';
import FactaLoadingPage from 'theme/facta/FactaLoadingPage';

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
				const noGP = getNoGP(res.success.actions);
				const noDW = getNoDW(res.success.actions);
				if (!noGP && !noDW) {
					history.push(apBasePath.getPathFromArgs({}))
					return null;
				} else {
					return {
						type: "Success",
						success: {
							noGP,
							noDW
						}
					}
				}
				
			}
		}).catch(err => Promise.resolve(null));  // TODO: handle failure
	}}
	shadowComponent={<FactaLoadingPage setBGImage={setAPImage} />}
/>);
