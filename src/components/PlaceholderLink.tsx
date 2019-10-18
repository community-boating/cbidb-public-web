import * as React from "react";

export default class PlaceholderLink extends React.PureComponent<{href?: string, style?: React.CSSProperties}> {
	render() {
		return <a href="#" style={this.props.style}>{this.props.children}</a>
	}	
}
export const placeholderAction = () => console.log("placeholder!")
