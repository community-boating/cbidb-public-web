import * as React from "react";
import FactaButton from '@facta/FactaButton';
import { History } from 'history';
import FactaArticleRegion from '@facta/FactaArticleRegion';
import { setJPImage } from "@util/set-bg-image";
import { jpBasePath } from "@paths/jp/_base";
import FactaMainPage from "@facta/FactaMainPage";

export default class JpRegistrationClosedPage extends React.PureComponent<{history: History<any>}> {
	render() {
		return <FactaMainPage setBGImage={setJPImage}>
			<FactaArticleRegion title="Registration is suspended.">
				Junior Program registration is currently suspended.  Please keep an eye on our <a target="_blank" href="https://www.community-boating.org">website</a> for more information!
			</FactaArticleRegion>
			<FactaButton text="< Back" onClick={() => Promise.resolve(this.props.history.push(jpBasePath.getPathFromArgs({})))}/>
		</FactaMainPage>
	}
}
