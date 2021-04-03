import * as React from "react";
import Page from "@components/Page";

interface Props {
	navBar?: JSX.Element,
	main: React.ReactNode,
	right: React.ReactNode,
}

export default class FactaSidebarPage extends Page<Props> {
	render() {
		return <div className="main-single-wrapper">
			<div className="container">
				<div className="row">
					{this.props.children}
					<table><tbody><tr>
						<td width="66%" style={{verticalAlign: "top"}}>
								<div className="main-single-content">

									<div className="blocks">

										<div className="container">
											<div className="row justify-content-center">
												<div className="col-12 ">
													{this.props.main}
												</div>
											</div>
										</div>

									</div>

								</div>
						</td>	
						<td style={{verticalAlign: "top"}}>
								<div className="sidebar-item sidebar-item-toc">
									{this.props.right}
								</div>
						</td>

					</tr></tbody></table>
					
					
				</div>
			</div>
		</div>
	}
}
