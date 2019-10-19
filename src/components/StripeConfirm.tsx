import * as React from 'react';
import { CardData } from '../containers/checkout/CheckoutWizard';
import { Option } from 'fp-ts/lib/Option';

export default (props: {cardData: CardData}) => {
	const zipElement: Option<React.ReactNode> = props.cardData.cardZip.map(zip => (
			<tr>
				<td align="right"><span className="optional" style={{fontWeight: "bold"}}>Zip</span></td>
				<td align="left" valign="middle"><span className="display_only apex-item-display-only">{zip}</span></td>
			</tr>
	))	
	return (
		<table className="formlayout"><tbody>
			<tr>
				<td align="right"><span className="optional" style={{fontWeight: "bold"}}>Card Number</span></td>
				<td align="left" valign="middle"><span className="display_only apex-item-display-only">{`**** ${props.cardData.cardLast4}`}</span></td>
			</tr>
			{zipElement.getOrElse("")}
			<tr>
				<td align="right"><span className="optional" style={{fontWeight: "bold"}}>Expiration</span></td>
				<td align="left" valign="middle"><span className="display_only apex-item-display-only">
					{`${props.cardData.cardExpMonth}/${props.cardData.cardExpYear}`}
				</span></td>
			</tr>
		</tbody></table>
	);
}