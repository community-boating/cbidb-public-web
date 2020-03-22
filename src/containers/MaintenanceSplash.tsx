import * as React from 'react';
import JoomlaMainPage from '../theme/joomla/JoomlaMainPage';
import JoomlaArticleRegion from '../theme/joomla/JoomlaArticleRegion';
import { setJPImage } from '../util/set-bg-image';

export default class MaintenanceSplash extends React.PureComponent {
	componentDidMount() {
		history.replaceState({}, "", "/")
	}
	render() {
		return (
			<JoomlaMainPage setBGImage={setJPImage}>
				<JoomlaArticleRegion title={"Temporarily Offline for Maintenance"}>
					The CBI online portal is currently down for maintenance.  Please check back later!<br />
					<br />
					If you just submitted a page, your action was processed if it was possible to do so.
				</JoomlaArticleRegion>
			</JoomlaMainPage>
		)
	}
}