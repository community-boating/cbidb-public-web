import * as React from "react";
import JoomlaMainPage from '../../theme/joomla/JoomlaMainPage';
import Button from '../../components/Button';
import { History } from 'history';
import JoomlaArticleRegion from '../../theme/joomla/JoomlaArticleRegion';
import { setJPImage } from "../../util/set-bg-image";
import { jpBasePath } from "../../app/paths/jp/_base";

export default class ClosedCovid extends React.PureComponent<{history: History<any>}> {
	render() {
		return <JoomlaMainPage setBGImage={setJPImage}>
			<JoomlaArticleRegion title="Registration will open in February!">
			We look forward to offering our Junior Program in 2021 with some safety/COVID revisions.
			Class registration for roll-over members will be available in the new year, and for new and returning members in February.
			Please keep a weather eye out for more information coming to your inbox after the holidays.
			<br /><br />
			Sincerely, Fiona and Niko
			</JoomlaArticleRegion>
			<Button text="< Back" onClick={() => Promise.resolve(this.props.history.push(jpBasePath.getPathFromArgs({})))}/>
		</JoomlaMainPage>
	}
}
