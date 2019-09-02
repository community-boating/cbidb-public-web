import * as React from "react";

interface JoomlaArticleRegionProps {
	title: React.ReactNode,
	buttons?: React.ReactNode
}

export default class JoomlaArticleRegion extends React.Component<JoomlaArticleRegionProps> {
	render() {
		return (
			<div className="rt-article">
				<div className="article-header">
					<h2>{this.props.title}</h2>
				</div>
				<div className="article-body">{this.props.children}</div>
				<div className="article-buttons" style={{ marginTop: "15px" }}>
					{this.props.buttons}
				</div>
			</div>
		)
	}
}