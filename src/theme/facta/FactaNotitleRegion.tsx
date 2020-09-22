import * as React from "react";

interface FactaNotitleRegionProps {
	buttons?: React.ReactNode
}

export default class FactaNotitleRegion extends React.Component<FactaNotitleRegionProps> {
	render() {
		return (
			<div style={{paddingBottom: "15px"}}>
				<div className="article-body">{this.props.children}</div>
				<div className="article-buttons" style={{ marginTop: "15px" }}>
					{this.props.buttons}
				</div>
			</div>
		)
	}
}