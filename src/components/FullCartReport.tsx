import * as React from 'react';
import JoomlaReport from '../theme/joomla/JoomlaReport';
import { CartItem } from '../async/get-cart-items';
import Currency from '../util/Currency';
import {postWrapper as deleteDonation} from "../async/member/delete-donation"
import { makePostJSON } from '../core/APIWrapperUtil';
import {History} from 'history'


const renderItemRow: (history: History<any>, setErrors: (err: string) => void) => (item: CartItem) => React.ReactNode[] = (history, setErrors) => item => [
	item.itemType=="Donation" ? <a href="#" onClick={e => {
		e.preventDefault();
		return deleteDonation.send(makePostJSON({fundId: item.fundId.getOrElse(null), amount: item.price}))
		.then(ret => {
			if (ret.type == "Success") {
				history.push("/redirect" + window.location.pathname)
			} else {
				setErrors(ret.message)
			}
		})
	}}><img src="/images/delete.png" /></a> : "",
	item.itemNameHTML,
	item.nameFirst.getOrElse("") + " " + item.nameLast.getOrElse(""),
	Currency.dollars(item.price).format()
];

const totalRow: (items: CartItem[]) => React.ReactNode[] = items => [
	"",
	"<b>Total</b>",
	"",
	<b>{Currency.dollars(items.map(i => i.price).reduce((sum, e) => sum + e)).format()}</b>
]

type Props = {
	cartItems: CartItem[],
	history: History<any>,
	setErrors: (err: string) => void
}

export default class FullCartReport extends React.PureComponent<Props> {
	render() {
		return (<JoomlaReport
			headers={["Cancel", "Item Name", "Member Name", "Price"]}
			rows={this.props.cartItems.map(renderItemRow(this.props.history, this.props.setErrors)).concat([totalRow(this.props.cartItems)])}
			rawHtml={{"1": true}}
		/>);
	}
}