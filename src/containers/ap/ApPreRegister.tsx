import * as React from "react";
import JoomlaMainPage from "../../theme/joomla/JoomlaMainPage";
import { setAPImage } from "../../util/set-bg-image";
import JoomlaArticleRegion from "../../theme/joomla/JoomlaArticleRegion";
import {History} from 'history'
import { jpBasePath } from "../../app/paths/jp/_base";
import { Link } from "react-router-dom";
import { apCreateAcctRoute } from "../../app/routes/ap/create-acct";

type Props = {
	history: History<any>
}

type State = {
}


export default class ApPreRegister extends React.PureComponent<Props, State> {
	render() {
		return <JoomlaMainPage setBGImage={setAPImage}>
			<JoomlaArticleRegion title="This Adult Program membership must be for you.">
			If you would like to purchase a membership for someone else you may do so by purchasing a CBI gift certificate.
			Please call the boathouse at 617-523-1038 for more information.
			<br />
			<br />
			<ul>
				<li><Link to={apCreateAcctRoute.getPathFromArgs({})}>I certify that I am purchasing a membership for myself.</Link></li>
				<li><a href="https://portal2.community-boating.org/ords/f?p=640">I would like to purchase a gift certificate for someone else.</a></li>
				<li><Link to={jpBasePath.getPathFromArgs({})}>I'm in the wrong place! Please take me to Junior Program registration.</Link></li>
			</ul>
			</JoomlaArticleRegion>
		</JoomlaMainPage>
	}
}
