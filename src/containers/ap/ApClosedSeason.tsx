import * as React from "react";
import JoomlaMainPage from '@joomla/JoomlaMainPage';
import { History } from 'history';
import FactaArticleRegion from '@facta/FactaArticleRegion';
import { setAPImage } from "@util/set-bg-image";
import { apBasePath } from "@paths/ap/_base";
import FactaButton from "@facta/FactaButton";
import FactaMainPage from "@facta/FactaMainPage";

export default class ApClosedSeason extends React.PureComponent<{history: History<any>}> {
	render() {
		return <FactaMainPage setBGImage={setAPImage}>
			<FactaArticleRegion title="Registration is suspended.">
				AP membership sales are closed for the 2020 season.  We hope to see you next year!
			</FactaArticleRegion>
			<FactaButton text="< Back" onClick={() => Promise.resolve(this.props.history.push(apBasePath.getPathFromArgs({})))}/>
		</FactaMainPage>
	}
}
