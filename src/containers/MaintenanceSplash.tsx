import * as React from 'react';
import FactaArticleRegion from 'theme/facta/FactaArticleRegion';
import { setJPImage } from 'util/set-bg-image';
import FactaMainPage from 'theme/facta/FactaMainPage';

export default class MaintenanceSplash extends React.PureComponent {
	componentDidMount() {
		history.replaceState({}, "", "/")
	}
	render() {
		return (
			<FactaMainPage setBGImage={setJPImage}>
				<FactaArticleRegion title={"Temporarily Offline for Maintenance"}>
					The CBI online portal is currently down for maintenance.  Please check back later!<br />
					<br />
					If you just submitted a page, your action was processed if it was possible to do so.
				</FactaArticleRegion>
			</FactaMainPage>
		)
	}
}