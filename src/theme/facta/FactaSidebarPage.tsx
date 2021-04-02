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
					<div className="col-12 col-lg-8 order-lg-1">
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
					</div>
					<div className="col-12 col-lg-4 order-lg-2 d-lg-block d-none">
						<div className="sidebar-item sidebar-item-toc">
							{this.props.right}
						</div>
					</div>
				</div>
			</div>
		</div>
	}
}
