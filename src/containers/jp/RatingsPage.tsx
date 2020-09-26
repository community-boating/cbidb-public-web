import { History } from 'history';
import * as React from "react";
import * as t from 'io-ts';

import JoomlaButton from "../../theme/facta/FactaButton";
import FactaArticleRegion from "../../theme/facta/FactaArticleRegion";
import NavBarLogoutOnly from '../../components/NavBarLogoutOnly';
import { none } from 'fp-ts/lib/Option';
import { setJPImage } from '../../util/set-bg-image';
import { validator as welcomeJPValidator } from "../../async/member-welcome-jp";
import { jpBasePath } from '../../app/paths/jp/_base';
import FactaMainPage from '../../theme/facta/FactaMainPage';

export interface Props {
	personId: number,
	welcomePackage: t.TypeOf<typeof welcomeJPValidator>,
	history: History<any>
}

export default class RatingsPage extends React.PureComponent<Props> {
	render() {
		console.log("ratings page!")
		const kid = this.props.welcomePackage.children.find(e => e.personId == this.props.personId)

		// TODO: specific kid.  Also welcome package seems to sometimes be empty
		const ratings = kid ? kid.ratings.getOrElse("") : "<span></span>"

		// TODO: grab specific child based on url
		return <FactaMainPage setBGImage={setJPImage} navBar={NavBarLogoutOnly({history: this.props.history, sysdate: none, showProgramLink: true})}>
			<FactaArticleRegion title="Ratings">
				<span dangerouslySetInnerHTML={{__html: ratings}}/>
				<p>
					<span style={{fontWeight: "bold", color:"red"}}>Acquired Rating</span>
					<br />
					<span style={{color: "#cc0", fontStyle: "italic", fontWeight: "bold"}}>Expired Rating*</span>
					<br />
					Unacquired Rating
				</p>
				<p style={{fontSize: "0.9em", color: "#777", fontStyle: "italic"}}>
					*Expired ratings can be renewed in the first days of your class
				</p>
				<JoomlaButton text="< Back" onClick={() => Promise.resolve(this.props.history.push(jpBasePath.getPathFromArgs({})))}/>
			</FactaArticleRegion>
		</FactaMainPage>
	}
}
