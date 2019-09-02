import { none } from "fp-ts/lib/Option";
import * as React from "react";

import { ApexItem, ApexItemProps } from "./ApexItem";

interface KeyValuePair {
	key: string,
	display?: string | JSX.Element
}

interface Props {
	id: string,
    updateAction?: (name: string, value: any) => void
	columns?: number,
	blurBox?: boolean
}

type PropsWithValues = Props & {
	values: KeyValuePair[]
}


// TODO: test pre-pop value from server state

// TODO: checkbox needs to add or remove value from running agg, return new agg

abstract class InputGroup<T_Form, T_Props extends Props, T_ValueType> extends ApexItem<T_Form, T_Props & ApexItemProps<T_Form, T_ValueType>, T_ValueType> {
	abstract isCheckbox: boolean
	abstract onClick: (ev: React.ChangeEvent<HTMLInputElement>) => void;
	abstract values: KeyValuePair[]
	abstract isChecked: (key: string) => boolean
    // private toggle(existingValues: string, newValue: string): string {
    //     const values = existingValues.split(this.props.delimiter);
        
    // }
    getElement() {
		const self = this
        const columns = this.props.columns || 1;

        console.log(this.isCheckbox)

        const group = this.isCheckbox ? "checkbox_group" : "radio_group"
        const apexItem = this.isCheckbox ? "apex-item-checkbox" : "apex-item-radio"
		const type = this.isCheckbox ? "checkbox" : "radio"
		
		console.log("rendering input group, value is " + this.props.value)

        return this.props.blurBox ? (<div></div>) : (<div id={this.props.id} className={group + " apex-item-group apex-item-group--rc " + apexItem}><div className={"apex-item-grid " + group}>
            {this.values.grouped(columns).map((cells, i) => {
                return (
					<div className="apex-item-grid-row" key={"row_" + i}>
					{cells.map(({key, display}) => {
						const checked = self.isChecked(key)
						return (<div className="apex-item-option" key={key}>
							<input type={type} id={this.props.id + "_" + key} name={this.props.id} value={key} onChange={this.onClick} checked={checked} />
							<label htmlFor={this.props.id + "_" + key}>{display == undefined ? key : display}</label>
						</div>)})
					}
					</div>
				);
            })}
        </div></div>);
    }
}

export class RadioGroup<T_Form> extends InputGroup<T_Form, PropsWithValues, string> {
	isCheckbox = false;
	values = this.props.values;
	isChecked = (key: string) => this.props.value.getOrElse("") == key
	onClick = (ev: React.ChangeEvent<HTMLInputElement>) => {
		if (this.props.updateAction) {
			this.props.updateAction(this.props.id, ev.target.value)
		}
	}
}

export class CheckboxGroup<T_Form> extends InputGroup<T_Form, PropsWithValues, string[]> {
	isCheckbox = true;
	values = this.props.values;
	isChecked = (key: string) => {
		const value = (this.props.value || none).getOrElse([])
		return value.contains(key)
	}  // TODO
	onClick = (ev: React.ChangeEvent<HTMLInputElement>) => {
		const value = (this.props.value || none).getOrElse([])
		if (ev.target.checked) {
			this.props.updateAction(this.props.id, value.concat([ev.target.value]));
		} else {
			const newValues = value.filter(e => e != ev.target.value)
			this.props.updateAction(this.props.id, newValues);
		}
	}
}

// TODO: ideally when unchecked this should set form state to some(false) rather than none but whatever
export class SingleCheckbox<T_Form> extends InputGroup<T_Form, Props, boolean> {
	isCheckbox = true;
	isChecked = (key: string) => (this.props.value || none).getOrElse(false)  // TODO
	values = [{key: "isTrue", display: this.props.justElement ? this.props.label : ""}];
	onClick = (ev: React.ChangeEvent<HTMLInputElement>) => this.props.updateAction(this.props.id, ev.target.checked);
}
