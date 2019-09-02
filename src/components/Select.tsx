import { none } from "fp-ts/lib/Option";
import * as React from "react";

import { ApexItem, ApexItemProps } from "./ApexItem";

export interface KeyAndDisplay {
	key: string,
	display: string
}

interface Props {
	options: KeyAndDisplay[],
	nullDisplay?: string
}

export class Select<T> extends ApexItem<T, Props & ApexItemProps<T, string>, string> {
	getElement() {
		const onChange = (ev: React.ChangeEvent<HTMLSelectElement>) => this.props.updateAction(this.props.id, ev.target.value);

		const nullOption: React.ReactNode[] = this.props.nullDisplay === undefined
		? []
		: [<option key={null} value="">{this.props.nullDisplay}</option>];

		return (
			<select
				id={this.props.id}
				name={this.props.id}
				className="selectlist apex-item-select"
				onChange={onChange}
				value={(this.props.value || none).getOrElse(undefined)}
			>
				{nullOption.concat(this.props.options.map(({key, display}) => <option value={key} key={key}>{display}</option>))}
			</select>
		)
	}
}

