import * as React from 'react';
import { Option } from 'fp-ts/lib/Option';
import { CardData } from 'async/order-status';

export default (props: {cardData: CardData, extraRow?: React.ReactNode}) => {
	const zipElement: Option<React.ReactNode> = props.cardData.zip.map(zip => (
			<tr>
				<td align="right"><span className="optional" style={{fontWeight: "bold"}}>Zip</span></td>
				<td style={{paddingLeft: "10px"}} align="left" valign="middle"><span className="display_only apex-item-display-only">{zip}</span></td>
			</tr>
	))	
	return (
		<table className="formlayout"><tbody>
			{props.extraRow}
			<tr>
				<td align="right"><span className="optional" style={{fontWeight: "bold"}}>Card Number</span></td>
				<td style={{paddingLeft: "10px"}} align="left" valign="middle"><span className="display_only apex-item-display-only">{`**** ${props.cardData.last4}`}</span></td>
			</tr>
			{zipElement.getOrElse("")}
			<tr>
				<td align="right"><span className="optional" style={{fontWeight: "bold"}}>Expiration</span></td>
				<td style={{paddingLeft: "10px"}} align="left" valign="middle"><span className="display_only apex-item-display-only">
					{`${props.cardData.expMonth}/${props.cardData.expYear}`}
				</span></td>
			</tr>
		</tbody></table>
	);
}
