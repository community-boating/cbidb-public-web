import * as React from "react";
import FactaButton from '../../theme/facta/FactaButton';
import { History } from 'history';
import FactaArticleRegion from '../../theme/facta/FactaArticleRegion';
import { setJPImage } from "../../util/set-bg-image";
import { jpBasePath } from "../../app/paths/jp/_base";
import FactaMainPage from "../../theme/facta/FactaMainPage";

export default class ClosedCovid extends React.PureComponent<{history: History<any>}> {
	render() {
		return <FactaMainPage setBGImage={setJPImage}>
			<FactaArticleRegion title="Registration is suspended.">
				Thank you for your patience and support this spring.
				We regret to inform you that CBI will not be able to offer the 2020 edition of our summer Junior Program.
				If we find later this summer that we can safely offer some limited youth events or other opportunities, we will notify you right away!
			</FactaArticleRegion>
			<FactaButton text="< Back" onClick={() => Promise.resolve(this.props.history.push(jpBasePath.getPathFromArgs({})))}/>
		</FactaMainPage>
	}
}
