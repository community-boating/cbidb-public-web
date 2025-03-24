import { SquareCard } from "async/member/square/upsert-square-customer"
import * as React from "react"
import StandardReport from "theme/facta/StandardReport"

export type StoredCardsProps = {
    cardsOnFile: SquareCard[]
}

export default function StoredCards(props: StoredCardsProps) {
    return <div>
        <StandardReport headers={["Name On Card", "Exp Date", "Last 4", "Use As Payment"]} rows={props.cardsOnFile.map(a => [
            a.cardholderName,
            a.expMonth + "/" + a.expYear,
            a.last4,
            "USE IT"
        ])}/>
    </div>
}