import { SquareCard } from "async/member/square/upsert-square-customer"
import * as React from "react"
import FactaButton from "theme/facta/FactaButton"
import StandardReport from "theme/facta/StandardReport"
import { postWrapper as deleteCard } from "async/member/square/delete-card"
import { makePostJSON } from "core/APIWrapperUtil"

export type StoredCardsProps = {
    orderAppAlias: string
    cardsOnFile: SquareCard[]
    payWithCard: (cardId: string) => Promise<any>
}

export default function StoredCards(props: StoredCardsProps) {
    return <div style={{width: "100%"}}>
        <StandardReport style={{width: "100%"}} headers={["Name On Card", "Exp Date", "Last 4", "Use As Payment", "Delete"]} rows={props.cardsOnFile.map(card => [
            <p style={{textAlign: "center"}}>{card.cardholderName || "None"}</p>,
            <p style={{textAlign: "center"}}>{card.expMonth + "/" + card.expYear}</p>,
            <p style={{textAlign: "center"}}>{card.last4}</p>,
            <div style={{width: "100%", textAlign: "center"}}>
                <FactaButton text="Pay With Card" spinnerOnClick onClick={(e) => {
                    e.preventDefault()
                    return props.payWithCard(card.id)
                }}/>
            </div>,
            <div style={{width: "100%", textAlign: "center"}}>
                <FactaButton text="Remove" spinnerOnClick onClick={(e) => {
                    e.preventDefault()
                    return deleteCard.send(makePostJSON({
                        orderAppAlias: props.orderAppAlias,
                        cardId: card.id
                    }))
                }}/>
            </div>
        ])}/>
    </div>
}