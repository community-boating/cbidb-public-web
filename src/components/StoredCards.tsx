import { SquareCard } from "async/member/square/upsert-square-customer"
import * as React from "react"
import FactaButton from "theme/facta/FactaButton"
import StandardReport from "theme/facta/StandardReport"
import { postWrapper as deleteCard } from "async/member/square/delete-card"
import { postWrapper as saveDefaultCard } from "async/member/square/update-default-payment-method"
import { makePostJSON } from "core/APIWrapperUtil"
import { IntentTypes } from "./SquarePaymentForm"

export type StoredCardsProps = {
    orderAppAlias: string
    cardsOnFile: SquareCard[]
    payWithCard: (cardId: string) => Promise<any>
    defaultCardId: string
    intent: IntentTypes
    setErrors: (errors: string[]) => void
    setDeletedCardIds: React.Dispatch<React.SetStateAction<string[]>>
    setDefaultCardId: React.Dispatch<React.SetStateAction<string>>
    updateInvoices: boolean,
    updateRecurringDonations: boolean
}

export default function StoredCards(props: StoredCardsProps) {
    const showPayWith = props.intent == "CHARGE_AND_STORE" || props.intent == "CHARGE"
    const headers = ["Name On Card", "Exp Date", "Last 4", "Delete", "Set Default"]
    const deleteCardId = (cardId: string) => {
        props.setDeletedCardIds((a) => a.concat(cardId))
    }
    if(showPayWith){
        headers.push("Pay With")
    }
    const rows = props.cardsOnFile.map(card => {
        const isDefault = props.defaultCardId == card.id
        const row = [
        <p style={{textAlign: "center"}}>{card.cardholderName || "None"}</p>,
        <p style={{textAlign: "center"}}>{card.expMonth + "/" + card.expYear}</p>,
        <p style={{textAlign: "center"}}>{card.last4}</p>,
        <div style={{width: "100%", textAlign: "center"}}>
            <FactaButton text="Remove" spinnerOnClick onClick={(e) => {
                e.preventDefault()
                return deleteCard.send(makePostJSON({
                    orderAppAlias: props.orderAppAlias,
                    cardId: card.id
                })).then((a) => {
                    if(a.type == "Success"){
                        deleteCardId(card.id)
                    }else{
                        props.setErrors(["Failed to delete card"])
                    }
                })
            }}/>
        </div>,
        <div style={{width: "100%", textAlign: "center"}}>
            {!isDefault ? <FactaButton text="Set Default" spinnerOnClick onClick={(e) => {
                e.preventDefault()
                return saveDefaultCard.send(makePostJSON({
                    orderAppAlias: props.orderAppAlias,
                    defaultCardId: card.id,
                    updateInvoices: props.updateInvoices,
                    updateRecurringDonations: props.updateRecurringDonations
                })).then((a) => {
                    if(a.type == "Success"){
                        props.setDefaultCardId(card.id)
                    }else{
                        props.setErrors(["Failed to save default card"])
                    }
                })
            }}/> : <p>Already Default</p>}
        </div>]
        if(showPayWith){
            row.push(
            <div style={{width: "100%", textAlign: "center"}}>
                <FactaButton text="Pay With Card" spinnerOnClick onClick={(e) => {
                    e.preventDefault()
                    return props.payWithCard(card.id)
                }}/>
            </div>)
        }
    return row
    })
    return <div style={{width: "100%"}}>
        <StandardReport style={{width: "100%"}} headers={headers} rows={rows}/>
    </div>
}