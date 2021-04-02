import * as React from "react";
import { setAPImage } from "@util/set-bg-image";
import FactaArticleRegion from "@facta/FactaArticleRegion";
import {History} from 'history'
import { jpBasePath } from "@paths/jp/_base";
import { Link } from "react-router-dom";
import { apCreateAcctRoute } from "@routes/ap/create-acct";
import FactaMainPage from "@facta/FactaMainPage";
import { giftCertificatesPageRoute } from "@routes/gift-certificates";

type Props = {
	history: History<any>
}

type State = {
}


export default class ApPreRegister extends React.PureComponent<Props, State> {
	render() {
		return <FactaMainPage setBGImage={setAPImage}>
			<FactaArticleRegion title="This Adult Program membership must be for you.">
			If you would like to purchase a membership for someone else you may do so by purchasing a CBI gift certificate.
			Please call the boathouse at 617-523-1038 for more information.
			<br />
			<br />
			<ul>
				<li><Link to={apCreateAcctRoute.getPathFromArgs({})}>I certify that I am purchasing a membership for myself.</Link></li>
				<li><Link to={giftCertificatesPageRoute.getPathFromArgs({})}>I would like to purchase a gift certificate for someone else.</Link></li>
				<li><Link to={jpBasePath.getPathFromArgs({})}>I'm in the wrong place! Please take me to Junior Program registration.</Link></li>
			</ul>
			</FactaArticleRegion>
		</FactaMainPage>
	}
}
