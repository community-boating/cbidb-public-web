import { History } from 'history';
import * as React from "react";

import Button from "../components/Button";
import JoomlaArticleRegion from "../theme/joomla/JoomlaArticleRegion";
import JoomlaMainPage from "../theme/joomla/JoomlaMainPage";
import { Form as HomePageForm } from "./HomePage";

// const mapStateToProps = (state: RootState) => ({
// 	welcomePackage: state.homePageForm.data,
// 	router: state.router
// })

// const mapDispatchToProps = (dispatch: Dispatch) => ({
// 	cancel: () => dispatch(push('/'))
// })

// type Props = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>

// export const path = '/ratings/:personId'

export interface Props {
	personId: number,
	welcomePackage: HomePageForm,
	history: History<any>
}

export default class RatingsPage extends React.PureComponent<Props> {
	constructor(props: Props) {
		super(props)
		console.log("in ratings page constructor")
	}
	componentDidMount() {
		console.log("in ratings page CDM")
	}
	render() {
		console.log("in ratings page render")
		const self = this;

		const kid = this.props.welcomePackage.children.find(e => e.personId == this.props.personId)

		// TODO: specific kid.  Also welcome package seems to sometimes be empty
		const ratings = kid ? kid.ratings.getOrElse("") : "<span></span>"

		// TODO: grab specific child based on url
		return <JoomlaMainPage>
			<JoomlaArticleRegion title="Ratings">
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
				<Button text="< Back" onClick={() => Promise.resolve(history.back())}/>
			</JoomlaArticleRegion>
		</JoomlaMainPage>
	}
}
