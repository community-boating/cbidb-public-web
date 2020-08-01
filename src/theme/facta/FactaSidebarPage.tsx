import * as React from "react";
import Page from "../../components/Page";
import FactaBase from "./FactaBase";

interface Props {
	navBar?: JSX.Element,
	main: React.ReactNode,
	left?: React.ReactNode
}

export default class FactaSidebarPage extends Page<Props> {
	render() {
		return <FactaBase>
			<div className="main-single-wrapper">
				<div className="container">
					<div className="row">
						<div className="col-12 col-lg-12 order-lg-2">
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
						<div className="col-12 col-lg-3 order-lg-1 d-lg-block d-none">

							<div className="sidebar-item sidebar-item-toc">
								{this.props.left}
							</div>
						</div>
					</div>
				</div>
			</div>
		</FactaBase>
	}
}
