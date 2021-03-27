import * as React from "react";
import Page from "@components/Page";
import FactaBase from "./FactaBase";

interface Props {
	navBar?: JSX.Element,
}

export default class FactaMainPage extends Page<Props> {
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
												{this.props.children}
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
