import * as React from "react";

type Props = {
	title: React.ReactNode
}

export default class FactaSidebarRegion extends React.Component<Props> {
	render() {
		return (
			<div style={{paddingBottom: "15px"}}>
				<h3>{this.props.title}</h3>
				<div>{this.props.children}</div>
			</div>
		)
	}
}