import * as React from "react";
import { Option } from "fp-ts/lib/Option";

export interface ApexItemProps<T_Form, T_ValueType> {
	id: string & keyof T_Form,
	value: Option<T_ValueType>,
	label?: string | JSX.Element,
	extraCells?: React.ReactNode,
	innerRef?: React.RefObject<any>,
	prependToElementCell?: React.ReactNode,
	appendToElementCell?: React.ReactNode,
	onChange?: (event: React.ChangeEvent) => void,
	onEnter?: () => void,
	updateAction?: (name: string, value: string) => void,
	justElement?: boolean,
	isRequired?: boolean
}

export abstract class ApexItem<T_Form, T_OwnProps, T_ValueType> extends React.PureComponent<T_OwnProps & ApexItemProps<T_Form, T_ValueType>> {
	abstract getElement(): React.ReactNode
	// constructor(props: T_OwnProps & ApexItemProps<T_Form, T_ValueType>) {
	// 	super(props)
	// 	if (this.props.updateAction) this.props.updateAction(this.props.id, null)
	// }
	getLabel() {
		return (
			<label id={this.props.id + "_LABEL"} htmlFor={this.props.id}>
				{this.props.isRequired ? <img src="/images/required.png" alt="Value Required" tabIndex={999} />: ""}
				<span className="optional">{this.props.label || ""}</span>
			</label>
		);
	}
	renderAsTableRow(): React.ReactNode {
		return (<tr>
			<td style={{ textAlign: "right" }}>
				{this.getLabel()}
			</td>
			<td style={{ textAlign: "left" }}>
				{this.props.prependToElementCell}
				{this.getElement()}
				{this.props.appendToElementCell}
			</td>
			{this.props.extraCells ? <td>{this.props.extraCells}</td> : null}
		</tr>);
	}
	render() {
		return this.props.justElement
		? this.getElement()
		: this.renderAsTableRow()
	}
}

