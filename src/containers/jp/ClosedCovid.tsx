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
			<JoomlaArticleRegion title="Registration opens February 15!">
			We look forward to offering our Junior Program in 2021 with some safety/COVID revisions. Early registration for roll-over members will open February 8,
			and for new and returning members registration will open February 15. 
			</JoomlaArticleRegion>
			<Button text="< Back" onClick={() => Promise.resolve(this.props.history.push(jpBasePath.getPathFromArgs({})))}/>
		</JoomlaMainPage>
	}
}
