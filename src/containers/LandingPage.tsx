import { History } from 'history';
import * as React from "react";

import FactaArticleRegion from "theme/facta/FactaArticleRegion";
import { setCheckoutImage } from 'util/set-bg-image';
import FactaMainPage from 'theme/facta/FactaMainPage';
import { apBasePath } from 'app/paths/ap/_base';
import { jpBasePath } from 'app/paths/jp/_base';

type Props = {
	history: History<any>
}

export default class LandingPage extends React.PureComponent<Props> {
	render() {
		return <FactaMainPage setBGImage={setCheckoutImage}>
			<FactaArticleRegion title="Welcome to Community Boating Online!">
				<div style={{fontSize: "1.1em"}}>
					To get started, select your program below.
					<br />
					<br />
					<ul>
						<li><a href={apBasePath.getPathFromArgs({})}>Adult Program</a></li>
						<li><a href={jpBasePath.getPathFromArgs({})}>Junior Program</a></li>
					</ul>
				</div>
			</FactaArticleRegion>
		</FactaMainPage>
	}
}
