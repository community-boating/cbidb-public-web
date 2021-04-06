import * as React from "react";

interface Props {
	headers: string[],
	rows: React.ReactNode[][],
	cellStyles?: React.CSSProperties[],
	rawHtml?: {[K: number]: boolean},
	noRowsText?: string
}

// TODO: drop the rawHTML override
export default (props: Props) => (
	<table cellPadding="0" cellSpacing="0" className="report-standard">
		<tbody><tr>
			{props.headers.zipWithIndex().map(headerTuple => (
				<th key={`header_${headerTuple[1]}`} className="header" style={({border: "none", textAlign: "center"})}>
					{headerTuple[0]}
				</th>
			))}
		</tr>
		{props.rows.zipWithIndex().map(([row, rowIndex]) => {
			const isEven = rowIndex % 2 == 0;
			const styles = props.cellStyles || []
			return (
				<tr className="highlight-row" key={`row_${rowIndex}`}>
					{row.zipWithIndex().map(([cellContents, cellIndex]) => {
						if (props.rawHtml && props.rawHtml[cellIndex]) {
							return (<td
								className="data"
								style={{...(styles[cellIndex] || {}), background: isEven ? "#FAFAFA" : "$F0F0F0", padding: "10px"}}
								key={`cell_${cellIndex}`}
								dangerouslySetInnerHTML={{__html: cellContents as string}}
							>
							</td>);
						} else {
							return (<td
								className="data"
								style={{...(styles[cellIndex] || {}), background: isEven ? "#FAFAFA" : "$F0F0F0", padding: "10px"}}
								key={`cell_${cellIndex}`}
							>
								{cellContents}
							</td>);
						}
					})}
				</tr>
			)
		})}
		</tbody>
	</table>
)
