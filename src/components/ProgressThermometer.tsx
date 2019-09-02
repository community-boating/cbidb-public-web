import * as React from "react";

import Breadcrumb from "../core/Breadcrumb";

// TODO
export default class ProgressThermometer extends Breadcrumb {
	renderStates() {
		const self = this
		const getKey = new class {
			private i: number
			constructor() {
				this.i = 0;
			}
			get(){
				return this.i++
			}
		}
		return (
			<div className="wizardProgress">
				<ul>
					{this.props.prevStates.map((state, i) => {
						if (i == 0){
							return <li key={"progtherm_" + getKey.get() } className="first-non-current"><span className="pastCurrent">{state.display}</span></li>
						} else {
							return <li key={"progtherm_" + getKey.get() } className="non-current"><span className="pastCurrent">{state.display}</span></li>
						}
					})}
					{(function() {
						if (self.props.prevStates.length == 0) {
							return <li key={"progtherm_" + getKey.get() } className="first-current"><span className="Current">{self.props.currState.display}</span></li>
						} else if (self.props.nextStates.length == 0) {
							return <li key={"progtherm_" + getKey.get() } className="last-current"><span>{self.props.currState.display}</span></li>
						} else {
							return <li key={"progtherm_" + getKey.get() } className="current"><span>{self.props.currState.display}</span></li>
						}
					}())}
					{this.props.nextStates.map((state, i, arr) => {
						if (i == arr.length-1) {
							return <li key={"progtherm_" + getKey.get() } className="last-non-current"><span>{state.display}</span></li>
						} else {
							return <li key={"progtherm_" + getKey.get() } className="non-current"><span>{state.display}</span></li>
						}
					})}
				</ul>
			</div>
		)
	}
}
