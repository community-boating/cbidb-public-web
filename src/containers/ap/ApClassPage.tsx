import * as React from "react";
import JoomlaMainPage from "../../theme/joomla/JoomlaMainPage";
import { setAPImage } from "../../util/set-bg-image";
import { apBasePath } from "../../app/paths/ap/_base";
import JoomlaArticleRegion from "../../theme/joomla/JoomlaArticleRegion";
import Button from "../../components/Button";
import {History} from 'history'
import Calendar from "../../components/Calendar";


type Props = {
	history: History<any>
}

type State = {
}


export default class ApClassPage extends React.PureComponent<Props, State> {
	render() {
		const self = this;
		return <JoomlaMainPage setBGImage={setAPImage}>
			<JoomlaArticleRegion title="AP Class Calendar">
				<Calendar />
			</JoomlaArticleRegion>
			<Button text="< Back" onClick={() => Promise.resolve(self.props.history.push(apBasePath.getPathFromArgs({})))}/>
		</JoomlaMainPage>
	}
}
