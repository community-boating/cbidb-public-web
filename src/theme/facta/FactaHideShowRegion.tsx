import * as React from "react";

interface FactaArticleRegionProps {
	title: React.ReactNode,
	buttons?: React.ReactNode
}

type State = {
	expanded: boolean
}

export class FactaHideShowRegion extends React.Component<FactaArticleRegionProps, State> {
	constructor(props: FactaArticleRegionProps) {
		super(props)
		this.state = {
			expanded: false
		}
	}
	render() {
		const arrow = (
			this.state.expanded
			? <img src="/images/down.png" />
			: <img src="/images/right.png" />
		)
		return (
			<div>
				<h3><span style={{cursor: "pointer"}} onClick={e => {
					e.preventDefault();
					this.setState({
						...this.state,
						expanded: !this.state.expanded
					})
				}}>{arrow}&nbsp;&nbsp;{this.props.title}</span></h3>
				{(
					this.state.expanded
					? (<React.Fragment>
						<div>{this.props.children}</div>
						<div className="article-buttons" style={{ marginTop: "15px" }}>
							{this.props.buttons}
						</div>
					</React.Fragment>)
					: null
				)}
			</div>
		)
	}
}