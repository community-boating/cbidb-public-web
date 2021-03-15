import * as React from 'react';
import JoomlaReport from '../theme/joomla/JoomlaReport';
import { CartItem } from '../async/get-cart-items';
import Currency from '../util/Currency';
import {postWrapper as deleteDonation} from "../async/member/delete-donation"
import { makePostJSON } from '../core/APIWrapperUtil';
import {History} from 'history'
import {postWrapper as unapplyGC} from "../async/member/unapply-gc"
import { PageFlavor } from './Page';

const renderItemRow: (
	history: History<any>,
	setErrors: (err: string) => void,
	includeCancel: boolean,
	pageFlavor: PageFlavor,
	exludeMemberName: boolean,
	hasAtLeastOneInMem: boolean
) => (item: CartItem) => React.ReactNode[] = (history, setErrors, includeCancel, pageFlavor, exludeMemberName, hasAtLeastOneInMem) => item => {
	const deleteLink = (function() {
		switch (item.itemType){ 
		case "Donation":
			return <a href="#" onClick={e => {
				e.preventDefault();
				return deleteDonation.send(makePostJSON({
					fundId: item.fundId.getOrElse(null),
					amount: item.price,
					program: pageFlavor
				}))
				.then(ret => {
					if (ret.type == "Success") {
						history.push("/redirect" + window.location.pathname)
					} else {
						setErrors(ret.message)
					}
				})
			}}><img src="/images/delete.png" /></a>;
		case "Gift Certificate Redeemed":
			return <a href="#" onClick={e => {
				e.preventDefault();
				return unapplyGC.send(makePostJSON({
					certId: item.itemId,
					program: pageFlavor
				}))
				.then(ret => {
					if (ret.type == "Success") {
						history.push("/redirect" + window.location.pathname)
					} else {
						setErrors(ret.message)
					}
				})
			}}><img src="/images/delete.png" /></a>;
		default:
			return "";
		}
	}());
	return (
		(includeCancel ? [deleteLink] : [])
		.concat(hasAtLeastOneInMem ? [(item.inMemoryOf).getOrElse(<span style={{color: "#888", fontStyle: "italic", fontSize: "0.9em"}}>(none)</span> as any)] : [])
		.concat([item.itemNameHTML])
		.concat(exludeMemberName ? [] : [item.nameFirst.getOrElse("") + " " + item.nameLast.getOrElse("")])
		.concat([Currency.dollars(item.price).format()])
	);
}

const totalRow: (items: CartItem[], includeCancel: boolean, excludeMemberName: boolean, hasAtLeastOneInMem: boolean) => React.ReactNode[] =
(items, includeCancel, excludeMemberName, hasAtLeastOneInMem) => {
	const firstCell: React.ReactNode[] = (includeCancel ? [""] : []);
	const memberCell = excludeMemberName ? [] : [""];
	return (
		firstCell
		.concat(hasAtLeastOneInMem ? [""] : [])
		.concat(["<b>Total</b>"])
		.concat(memberCell)
		.concat([<b>{Currency.dollars(items.map(i => i.price).reduce((sum, e) => sum + e)).format()}</b>])
	);
}

type Props = {
	cartItems: CartItem[],
	history: History<any>,
	setErrors: (err: string) => void,
	includeCancel: boolean,
	extraFooterRow?: React.ReactNode[],
	pageFlavor: PageFlavor,
	excludeMemberName?: boolean
}

export default class FullCartReport extends React.PureComponent<Props> {
	render() {
		const hasAtLeastOneInMem = this.props.cartItems.reduce((agg, item) => agg || item.inMemoryOf.isSome(), false);
		const totalCellPosition = String(0 + (this.props.includeCancel ? 1 : 0) + (hasAtLeastOneInMem ? 1 : 0));
		const rawHtml = {[totalCellPosition]: true};
		const render = renderItemRow(
			this.props.history,
			this.props.setErrors,
			this.props.includeCancel,
			this.props.pageFlavor,
			!!this.props.excludeMemberName,
			hasAtLeastOneInMem,
		);
		
		return (<JoomlaReport
			headers={
				(this.props.includeCancel ? ["Cancel"] : [])
				.concat(hasAtLeastOneInMem ? ["In Memory/Honor Of"] : [])
				.concat(["Item Name"])
				.concat(this.props.excludeMemberName ? [] : ["Member Name"])
				.concat(["Price"])
			}
			rows={this.props.cartItems.map(render)
				.concat([totalRow(this.props.cartItems, this.props.includeCancel, !!this.props.excludeMemberName, hasAtLeastOneInMem)])
				.concat(this.props.extraFooterRow ? [
					(this.props.includeCancel ? ["" as React.ReactNode] : []).concat(this.props.extraFooterRow)
				] : [])
			}
			rawHtml={rawHtml}
		/>);
	}
}
