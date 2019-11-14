import * as React from 'react';
import JoomlaReport from '../theme/joomla/JoomlaReport';
import { CartItem } from '../async/get-cart-items';
import Currency from '../util/Currency';

const renderItemRow: (item: CartItem) => React.ReactNode[] = item => [
	item.itemNameHTML,
	item.nameFirst.getOrElse("") + " " + item.nameLast.getOrElse(""),
	Currency.dollars(item.price).format()
];

const totalRow: (items: CartItem[]) => React.ReactNode[] = items => [
	"<b>Total</b>",
	"",
	<b>{Currency.dollars(items.map(i => i.price).reduce((sum, e) => sum + e)).format()}</b>
]

export default class FullCartReport extends React.PureComponent<{cartItems: CartItem[]}> {
	render() {
		return (<JoomlaReport
			headers={["Item Name", "Member Name", "Price"]}
			rows={this.props.cartItems.map(renderItemRow).concat([totalRow(this.props.cartItems)])}
			rawHtml={{"0": true}}
		/>);
	}
}