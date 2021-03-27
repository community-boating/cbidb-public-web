import * as React from "react";
import Page from "@components/Page";
import FactaBase from "./FactaBase";

interface Props {
	navBar?: JSX.Element,
	left: JSX.Element,
	right: JSX.Element
}

export default class FactaTwoColumns extends Page<Props> {
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
											<div className="col-12" style={{display: "flex", flexWrap: "wrap"}}>
												{this.props.children}
												<div>{this.props.left}</div>
												<div>{this.props.right}</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</FactaBase>
	}
}
