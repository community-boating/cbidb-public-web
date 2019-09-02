import * as React from "react";

export default class PlaceholderLink extends React.PureComponent<{href?: string}> {
	render() {
		return <a href="#">{this.props.children}</a>
	}	
}
export const placeholderAction = () => console.log("placeholder!")
