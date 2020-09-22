import * as React from "react";
import JoomlaMainPage from '../../theme/joomla/JoomlaMainPage';
import { History } from 'history';
import JoomlaArticleRegion from '../../theme/joomla/JoomlaArticleRegion';
import { setAPImage } from "../../util/set-bg-image";
import { apBasePath } from "../../app/paths/ap/_base";
import FactaButton from "../../theme/facta/FactaButton";
import FactaMainPage from "../../theme/facta/FactaMainPage";

export default class ApClosedSeason extends React.PureComponent<{history: History<any>}> {
	render() {
		return <FactaMainPage setBGImage={setAPImage}>
			<JoomlaArticleRegion title="Registration is suspended.">
				AP membership sales are closed for the 2020 season.  We hope to see you next year!
			</JoomlaArticleRegion>
			<FactaButton text="< Back" onClick={() => Promise.resolve(this.props.history.push(apBasePath.getPathFromArgs({})))}/>
		</FactaMainPage>
	}
}
