import { none, Option, some } from "fp-ts/lib/Option";
import * as React from "react";

import { Select } from "./Select";
import TextInput from "./TextInput";


export interface PhoneTriBoxProps<U> {
    label: string,
    firstID: string & keyof U,
    secondID: string & keyof U,
    thirdID: string & keyof U,
    extID: string & keyof U,
    typeID: string & keyof U,
    firstValue: Option<string>,
    secondValue: Option<string>,
    thirdValue: Option<string>,
    extValue: Option<string>
    typeValue: Option<string>,
    updateAction?: (name: string, value: string) => void,
    isRequired?: boolean
}

export const splitPhone = (phone: Option<string>) => phone.fold(
	{
		first: none as Option<string>,
		second: none as Option<string>,
		third: none as Option<string>,
		ext: none as Option<string>
	},
	p => ({
		first: some(p.substr(0,3)),
		second: some(p.substr(3,3)),
		third: some(p.substr(6,4)),
		ext: some(p.substr(10))
	})
)

export const combinePhone = (
	first: Option<string>,
	second: Option<string>,
	third: Option<string>,
	ext:  Option<string>
) => {
	if (
		first.isNone() && 
		second.isNone() && 
		third.isNone() && 
		ext.isNone()
	) {
		return none;
	} else {
		return some([
			first.getOrElse(""),
			second.getOrElse(""),
			third.getOrElse(""),
			ext.getOrElse("")
		].join(""))
	}
}


export default class PhoneTriBox<U, T extends PhoneTriBoxProps<U>> extends React.PureComponent<T> {
	render() {
        const self = this
        const second = <TextInput<U>
            id={self.props.secondID}
            value={self.props.secondValue}
            updateAction={self.props.updateAction}
            isRequired={self.props.isRequired}
            size={3}
            maxLength={3}
            justElement={true}
        />
        const third = <TextInput<U>
            id={self.props.thirdID}
            value={self.props.thirdValue}
            updateAction={self.props.updateAction}
            isRequired={self.props.isRequired}
            size={4}
            maxLength={4}
            justElement={true}
        />
        const ext = <TextInput<U>
            id={self.props.extID}
            value={self.props.extValue}
            updateAction={self.props.updateAction}
            isRequired={self.props.isRequired}
            size={5}
            justElement={true}
        />
        return <React.Fragment>
			<TextInput<U>
				id={self.props.firstID}
				label={self.props.label}
				value={self.props.firstValue}
				updateAction={self.props.updateAction}
				isRequired={self.props.isRequired}
				size={3}
				maxLength={3}
				prependToElementCell="("
				appendToElementCell={(
					<span>
						{") - "}
						{second}
						{" - "}
						{third}
						{"  ext."}
						{ext}
					</span>
				)}
			/>
			<Select<U>
				id={self.props.typeID}
				label="Type"
				isRequired={self.props.isRequired}
				value={self.props.typeValue}
				updateAction={self.props.updateAction}
				options={["Home", "Work", "Cell"].map(k => ({key: k, display: k}))}
				nullDisplay="- Select -"
			/>
		</React.Fragment>
	}
}