import * as React from "react";

interface JoomlaArticleRegionProps {
	title: React.ReactNode,
	buttons?: React.ReactNode
}

type State = {
	expanded: boolean
}

export default class JoomlaHideShowRegion extends React.Component<JoomlaArticleRegionProps, State> {
	constructor(props: JoomlaArticleRegionProps) {
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
			<div className="rt-article">
				<div className="article-header">
					<h2><a href="#" onClick={e => {
						e.preventDefault();
						this.setState({
							...this.state,
							expanded: !this.state.expanded
						})
					}}>{arrow}&nbsp;&nbsp;{this.props.title}</a></h2>
				</div>
				{(
					this.state.expanded
					? (<React.Fragment>
						<div className="article-body">{this.props.children}</div>
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