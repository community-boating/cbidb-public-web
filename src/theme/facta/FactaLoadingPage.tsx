import * as React from "react";
import Page from "components/Page";

interface Props {
	spinner?: boolean
	navBar?: JSX.Element,
}

export default class FactaLoadingPage extends Page<Props> {
	render() {
		return <div className="main-single-wrapper">
			<div className="container">
				<div className="row">
					<div className="col-12 col-lg-12 order-lg-2">
						<div className="main-single-content">
							<div className="blocks">
								<div className="container">
									<div className="row justify-content-center">
										<div className="col-12 " style={{textAlign: "center"}}>
											{this.props.spinner ? <img src="/images/spinner-grey.gif" /> : null}
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
	}
}
