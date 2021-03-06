import * as React from "react";

interface FactaArticleRegionProps {
	title: React.ReactNode,
	buttons?: React.ReactNode
	id?: string
}

export default class FactaArticleRegion extends React.Component<FactaArticleRegionProps> {
	render() {
		return (
			<div id={this.props.id} style={{paddingBottom: "15px"}}>
				<h3>{this.props.title}</h3>
				<div>{this.props.children}</div>
				{this.props.buttons
				? <div className="article-buttons" style={{ marginTop: "15px" }}>
					{this.props.buttons}
				</div>
				: null}
				
			</div>
		)
	}
}