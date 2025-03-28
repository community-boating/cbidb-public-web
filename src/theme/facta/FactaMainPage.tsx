import * as React from "react";
import Page from "components/Page";
import { FactaInfoDiv } from "./FactaInfoDiv";
import { FactaErrorDiv } from "./FactaErrorDiv";

interface Props {
	navBar?: JSX.Element
	infosOverride?: string[]
	errors?: string[]
}

export default class FactaMainPage extends Page<Props> {
	render() {
		const errors = (this.props.errors && this.props.errors.length > 0) ? this.props.errors : undefined
		const infos = errors ? undefined : this.props.infosOverride || ["Gift cards issued before March 25 2025 are currently being imported into the new payments system and will not work temporarily. We have not yet received a timeline from Square on the import process."]
		
		return <div className="main-single-wrapper">
			<div className="container">
				<div className="row">
					<div className="col-12 col-lg-12 order-lg-2">
						<div className="main-single-content">
							<div className="blocks">
								<div className="container">
									<div className="row justify-content-center">
										<div className="col-12 ">
											{infos ? <FactaInfoDiv infos={infos}/> : <></>}
											{errors ? <FactaErrorDiv errors={errors}/> : <></>}
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
