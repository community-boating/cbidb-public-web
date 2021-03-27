import * as React from 'react';
import * as t from 'io-ts';
import Currency from '@util/Currency';
import * as moment from 'moment';

import { validator as gcValidator } from "@async/member/gc-purchase"
import { GiftCertDeliveryMethod } from "./GiftCertificatesDetailsPage"


type GC = t.TypeOf<typeof gcValidator>;

export default (props: GC) => {
	const purchasePrice = Currency.cents(props.purchasePriceCents).format();

	const deliverBy = (function() {
		switch(props.deliveryMethod){
		case GiftCertDeliveryMethod.Email:
			return "Email";
		case GiftCertDeliveryMethod.Mail:
			return moment().add(10, 'days').format("MM/DD/YYYY")
		case GiftCertDeliveryMethod.Pickup:
			return <React.Fragment>Pickup at CBI<br />(please bring a valid photo ID)</React.Fragment>
		}
	}());

	const mail = <td>
		<table><tbody>
			<tr><td>
				<b>Delivery Details</b>
			</td></tr>
			<tr><td>
				{props.addr1.getOrElse("")}
			</td></tr>
			{props.addr2.map(a2 => <tr><td>{a2}</td></tr>).getOrElse(null)}
			<tr><td>
				{`${props.city.getOrElse("")}, ${props.state.getOrElse("")} ${props.zip.getOrElse("")}`}
			</td></tr>
		</tbody></table>
	</td>;

	return <table cellPadding="15"><tbody><tr style={{ verticalAlign: "top" }}>
		<td>
			<table><tbody>
				<tr><td>
					<b>Certificate Details</b>
				</td></tr>
				<tr><td>
					Value: {purchasePrice}
				</td></tr>
				<tr><td>
					Expires: {moment().add(84, 'months').format("MM/DD/YYYY")}
				</td></tr>
				<tr><td>
					<i>Deliver by: {deliverBy}</i>
				</td></tr>
			</tbody></table>
		</td>
		<td>
			<table><tbody>
				<tr><td>
					<b>Purchaser Details</b>
				</td></tr>
				<tr><td>
					{`${props.purchaserNameFirst.getOrElse("")} ${props.purchaserNameLast.getOrElse("")}`}
				</td></tr>
				<tr><td>
					{props.purchaserEmail.getOrElse("")}
				</td></tr>
			</tbody></table>
		</td>
		<td>
			<table><tbody>
				<tr><td>
					<b>Recipient Details</b>
				</td></tr>
				<tr><td>
					{`${props.recipientNameFirst.getOrElse("")} ${props.recipientNameLast.getOrElse("")}`}
				</td></tr>
				{(
					props.deliveryMethod == GiftCertDeliveryMethod.Email
					? <tr><td>
						{props.recipientEmail.getOrElse("")}
					</td></tr>
					: null
				)}
			</tbody></table>
		</td>
		{(
			props.deliveryMethod == GiftCertDeliveryMethod.Mail
			? mail
			: null
		)}
	</tr></tbody></table>
}