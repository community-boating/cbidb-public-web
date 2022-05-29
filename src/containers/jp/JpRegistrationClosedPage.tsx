import * as React from "react";
import FactaButton from 'theme/facta/FactaButton';
import { History } from 'history';
import FactaArticleRegion from 'theme/facta/FactaArticleRegion';
import { setJPImage } from "util/set-bg-image";
import { jpBasePath } from "app/paths/jp/_base";
import FactaMainPage from "theme/facta/FactaMainPage";

export default class JpRegistrationClosedPage extends React.PureComponent<{history: History<any>}> {
	render() {
		return <FactaMainPage setBGImage={setJPImage}>
			<FactaArticleRegion title="Registration is closed.">
				Registration is closed for the 2021 season. Please keep an eye on our <a target="_blank" href="https://www.community-boating.org">website</a> for when registration will open for 2022.
			</FactaArticleRegion>
			<FactaButton text="< Back" onClick={() => Promise.resolve(this.props.history.push(jpBasePath.getPathFromArgs({})))}/>
		</FactaMainPage>
	}
}
