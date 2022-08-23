import * as React from "react";
import FactaButton from 'theme/facta/FactaButton';
import { History } from 'history';
import FactaArticleRegion from 'theme/facta/FactaArticleRegion';
import { setJPImage } from "util/set-bg-image";
import { jpBasePath } from "app/paths/jp/_base";
import FactaMainPage from "theme/facta/FactaMainPage";
import * as moment from 'moment';

export default class JpRegistrationClosedPage extends React.PureComponent<{history: History<any>}> {
	render() {
		const now = moment();
		const month = Number(now.format("M"));
		const year = Number(now.format("YYYY"));

		const isPreSeason = month < 7;
		const closedSeason = isPreSeason ? year-1 : year;

		return <FactaMainPage setBGImage={setJPImage}>
			<FactaArticleRegion title="Registration is closed.">
				Registration is closed for the {closedSeason} season. Please keep an eye on our <a target="_blank" href="https://www.community-boating.org">website</a> for when registration will open for {closedSeason+1}.
			</FactaArticleRegion>
			<FactaButton text="< Back" onClick={() => Promise.resolve(this.props.history.push(jpBasePath.getPathFromArgs({})))}/>
		</FactaMainPage>
	}
}
