import * as React from "react";
import Page from "../../components/Page";

interface Joomla8_4Props {
	main: React.ReactNode,
	right: React.ReactNode
}

export default class Joomla8_4 extends Page<Joomla8_4Props> {
	render() {
		return (
			<div className="rt-container">
				<style dangerouslySetInnerHTML={{__html: `
					.article-body { font-size: 1.2em !important }
				`}} />
				<div className="rt-grid-8">
					<div id="rt-main-column" className="page-content-light">
						<div className="rt-block component-block" style={({minHeight: "350px"})}>
							<div style={({position: "absolute", "right": "20px"})}></div>
							<div id="rt-mainbody">
								<div className="component-content rt-joomla">
									<div className="rt-joomla ">
										{this.props.main}
									</div>
								</div>
							</div>
							<div className="clear"></div>
						</div>
					</div>
				</div>
				<div className="rt-grid-4">
					<div className="rt-sidebar-surround page-block">
						<div id="rt-sidebar-a">
							{this.props.right}
						</div>
					</div>
				</div>
				<div className="clear"></div>
			</div>
		)
	}
}
