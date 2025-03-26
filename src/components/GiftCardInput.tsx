import * as React from "react";
import FactaButton from "theme/facta/FactaButton";
import { postWrapper as checkGiftCard } from "async/member/square/search-gift-card"
import { makePostJSON } from "core/APIWrapperUtil";
import { SquareGiftCard } from "async/member/square/upsert-square-customer";

const gcTypeMap = {
    "PHYSICAL": "Physical",
    "DIGITAL" : "Digital"
}

export type GiftCardInputProps = {
    handleSubmit: (cardId: string) => Promise<any>
    orderAppAlias: string
}

function GiftCardInfo(props: {giftCard: SquareGiftCard}){
    return <div>
        <h3>Type: {gcTypeMap[props.giftCard.type]}</h3>
        <h3>Balance: {props.giftCard.balanceMoney.amount}</h3>
    </div>
}

export default function GiftCardInput(props: GiftCardInputProps){
    const [gan, setGan] = React.useState("")
    const [foundCard, setFoundCard] = React.useState<SquareGiftCard>(null)
    const buttonText = foundCard ? "Pay using Gift Card" : "Search for Gift Card"
    return <div>
        <div style={{width: "50%"}}>
            <label htmlFor="giftCardInput">Enter Gift Card Number Or Online Redepemtion Code :</label>
            <br/>
            <input id="giftCardInput" className="text_field apex-item-text" style={{marginBottom: "10px", width: "210px" }} value={gan} onChange={(e) => {
                e.preventDefault()
                setGan(e.target.value)
            }}/>
            <br/>
            <FactaButton text={buttonText} spinnerOnClick onClick={() => {
                if(foundCard){
                    return props.handleSubmit(foundCard.id)
                }
                return checkGiftCard.send(makePostJSON({
                    orderAppAlias: props.orderAppAlias,
                    GAN: gan
                })).then((r) => {
                    if(r.type == "Success"){
                        setFoundCard(r.success.squareGiftCard)
                    }else{
                        setFoundCard(undefined)
                    }
                })
            } }/>
        </div>
        {foundCard === null ? <></> : foundCard === undefined ? <p>Gift Card not found!</p> : <GiftCardInfo giftCard={foundCard}/>}
    </div>
}