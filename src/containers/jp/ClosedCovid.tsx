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
			<JoomlaArticleRegion title="Registration is temporarily suspended.">
				JP signups are on hold as of May 23. Although we still hope to offer a 2020 Junior Program adapted to new conditions of operation,
				we cannot make this commitment until we know the State's regulations for children's summer programming.
				The State's guidance on coordinating summer camps will inform our final decision on what we can do this year.
			</JoomlaArticleRegion>
			<Button text="< Back" onClick={() => Promise.resolve(this.props.history.push(jpBasePath.getPathFromArgs({})))}/>
		</JoomlaMainPage>
	}
}
