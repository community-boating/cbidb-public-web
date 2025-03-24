import * as React from "react";
import FactaButton from "theme/facta/FactaButton";
import { postWrapper as checkGiftCard } from "async/member/square/search-gift-card"
import { makePostJSON } from "core/APIWrapperUtil";

export type GiftCardInputProps = {
    handleSubmit: (gan: string) => Promise<any>
}

export default function GiftCardInput(props: GiftCardInputProps){
    const [gan, setGan] = React.useState("")
    const buttonText = "Check"
    return <div>
        <label htmlFor="giftCardInput">Enter Gift Card Number Or Online Redepemtion Code :</label>
        <br/>
        <input id="giftCardInput" className="text_field apex-item-text" style={{marginBottom: "10px" }} value={gan} onChange={(e) => {
            e.preventDefault()
            setGan(e.target.value)
        }}/>
        <br/>
        <FactaButton text={buttonText} spinnerOnClick onClick={() => {
            return checkGiftCard.send(makePostJSON({
                GAN: gan
            }))
        } }/>
    </div>
}