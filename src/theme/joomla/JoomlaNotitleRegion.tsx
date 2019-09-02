import * as React from "react";

interface JoomlaNotitleRegionProps {
	buttons?: React.ReactNode
}

export default class JoomlaNotitleRegion extends React.Component<JoomlaNotitleRegionProps> {
	render() {
		return (
			<div className="rt-article">
				<div className="article-body">{this.props.children}</div>
				<div className="article-buttons" style={{ marginTop: "15px" }}>
					{this.props.buttons}
				</div>
			</div>
		)
	}
}