import { CardDetails, ChargeVerifyBuyerDetails, PaymentRequestOptions, StoreVerifyBuyerDetails, TokenResult, VerifyBuyerResponseDetails } from "@square/web-payments-sdk-types"
import { APIConstants } from "async/member/square/fetch-api-constants"
import { SquareOrder } from "async/member/square/upsert-compass-order"
import { SquareCustomerInfo } from "async/member/square/upsert-square-customer"
import { postWrapper as storeCard } from "async/member/square/store-card"
import * as React from "react"
import { ApplePay, CreditCard, GooglePay, PaymentForm } from "react-square-web-payments-sdk"
import { makePostJSON } from "core/APIWrapperUtil"
import { none, some } from "fp-ts/lib/Option"
import {postWrapper as payOrderViaPaymentSource} from "async/member/square/pay-order-via-payment-source"
import {postWrapper as payOrderViaGiftCard} from "async/member/square/pay-order-via-gift-card"
import TabGroup from "./TabGroup"
import StoredCards from "./StoredCards"
import GiftCardInput from "./GiftCardInput"

export type SquarePaymentFormProps = {
    apiConstants: APIConstants
    squareInfo: SquareCustomerInfo
    order: SquareOrder
    intentOverride?: string
    orderAppAlias: string
}

type IntentTypes = "CHARGE" | "CHARGE_AND_STORE" | "STORE"

function isIntentValid(intent: string): intent is IntentTypes {
    return ["CHARGE", "CHARGE_AND_STORE", "STORE"].contains(intent)
}

function convertMoneyToFloat(money: number){
    return String(money / 100)
}

function mapVertificationDetails(props: SquarePaymentFormProps, intent: IntentTypes): ChargeVerifyBuyerDetails | StoreVerifyBuyerDetails {
    const verificationInfo = props.squareInfo.verificationDetails
    const billingContact = verificationInfo.billingContact
    const order = props.order
    return {
        amount: verificationInfo.amountOverride.getOrElse(convertMoneyToFloat(order.squareOrder.totalMoney.amount)),
        billingContact: {
            givenName: billingContact.givenName.getOrElse(undefined),
            familyName: billingContact.familyName.getOrElse(undefined),
            email: billingContact.email,
            phone: billingContact.phone.getOrElse(undefined),
            addressLines: billingContact.addressLines,
            city: billingContact.city.getOrElse(undefined),
            state: billingContact.state.getOrElse(undefined),
            countryCode: billingContact.country.getOrElse(undefined)
        },
        currencyCode: verificationInfo.currencyCode,
        intent: intent,
    }

}

function mapPaymentRequest(props: SquarePaymentFormProps, intent: IntentTypes): PaymentRequestOptions {
    console.log(props.squareInfo.verificationDetails.billingContact.country)
    return {
        countryCode: props.squareInfo.verificationDetails.billingContact.country.getOrElse("US"),
        currencyCode: props.squareInfo.verificationDetails.currencyCode,
        total: {amount: convertMoneyToFloat(props.order.squareOrder.totalMoney.amount), label:"Total"}
    }
}

function mapCardIntentToButtonText(intent: IntentTypes){
    switch(intent){
        case "CHARGE":
            return "Pay"
        case "CHARGE_AND_STORE":
            return "Pay and Save Card"
        case "STORE":
            return "Save Card"
    }
}

const PAYMENT_TYPES = {
    CREDIT_CARD: {
        key: "CREDIT_CARD",
        display: "Credit Card"
    },
    STORED_CARD: {
        key: "STORED_CARD",
        display: "Saved Cards"
    },
    GIFT_CARD: {
        key: "GIFT_CARD",
        display: "Gift Card"
    },
    APPLE_PAY: {
        key: "APPLE_PAY",
        display: "Apple Pay"
    },
    GOOGLE_PAY: {
        key: "GOOGLE_PAY",
        display: "Google Pay"
    }
}

function isPaymentDisabled(props: SquarePaymentFormProps, paymentType: typeof PAYMENT_TYPES.CREDIT_CARD){
    switch(paymentType){
        case PAYMENT_TYPES.APPLE_PAY:
            return true
        case PAYMENT_TYPES.GOOGLE_PAY:
            return false
        case PAYMENT_TYPES.CREDIT_CARD:
        case PAYMENT_TYPES.GIFT_CARD:
            return false
        case PAYMENT_TYPES.STORED_CARD:
            return props.squareInfo.cardsOnFile.length == 0
    }
}

export default function SquarePaymentForm(props: SquarePaymentFormProps){
    const [paymentType, setPaymentType] = React.useState(PAYMENT_TYPES.CREDIT_CARD.key)
    const [buttonDisableOverride, setButtonDisableOverride] = React.useState(false)
    const [storePayment, setStorePayment] = React.useState(props.intentOverride == "STORE" || props.intentOverride == "CHARGE_AND_STORE")
    const intentProvided = props.squareInfo.verificationDetails.intentOverride.getOrElse(props.intentOverride)
    const intent = isIntentValid(intentProvided) ? intentProvided : (storePayment ? "CHARGE_AND_STORE" : "CHARGE")
    const storeOnly = intentProvided == "STORE"
    const verificationDetails = React.useMemo(() => mapVertificationDetails(props, intent), [intent])
    const paymentRequest = React.useMemo(() => mapPaymentRequest(props, intent), [intent])
    const tabGroupsMapped = Object.values(PAYMENT_TYPES).map(paymentType => ({...paymentType, disabled: isPaymentDisabled(props, paymentType)}))
    console.log(tabGroupsMapped)
    return <PaymentForm applicationId={props.apiConstants.squareApplicationId} locationId={props.apiConstants.squareLocationId} cardTokenizeResponseReceived={function (result: TokenResult, verifiedBuyer?: VerifyBuyerResponseDetails | null): void {
        if(result.errors == null && result.token != null && paymentType != PAYMENT_TYPES.GIFT_CARD.key){
            const verificationTokenOpt = (verifiedBuyer && verifiedBuyer.token) ? some(verifiedBuyer.token) : none
            const doCharge = () => {
                return payOrderViaPaymentSource.send(makePostJSON({
                    orderAppAlias: props.orderAppAlias,
                    paymentSourceId: result.token,
                    partialPayment: false,
                    verificationToken: verificationTokenOpt
                }))
            }
            const doStore = (card: CardDetails) => {
                return storeCard.send(makePostJSON({
                    sourceId: result.token,
                    cardToSave: card as any,
                    verificationToken: verificationTokenOpt
                }))
            }
            const handleResult = (promise: Promise<any>) => {
                promise.catch((e) => {
                    alert("Failed to charge or store payment!")
                }).finally(() => {
                    setButtonDisableOverride(false)
                })
            }
            if(intent == "CHARGE"){
                handleResult(doCharge())
            }else{
                if(paymentType == PAYMENT_TYPES.CREDIT_CARD.key && result.details && result.details.card){
                    const card = result.details.card
                    if(intent == "CHARGE_AND_STORE"){
                        handleResult(Promise.all([doCharge(), doStore(card)]))
                    }else{
                        handleResult(doStore(card))
                    }
                }else{
                    handleResult(doCharge())
                }
            }
        }else{
            setButtonDisableOverride(false)
        }
        //Hopefully square input elements will handle the error displaying
    }} createVerificationDetails={() => verificationDetails} createPaymentRequest={() => paymentRequest}>
        <TabGroup tabGroups={tabGroupsMapped} locked={buttonDisableOverride} controlled={{tabKey: paymentType, setTabKey: setPaymentType}}>
            <div key={PAYMENT_TYPES.CREDIT_CARD.key}>
                <CreditCard buttonProps={{
                    isLoading: buttonDisableOverride,
                    onClick: () => {
                        console.log("clicking")
                        setButtonDisableOverride(true)
                    }
                }}>
                    {mapCardIntentToButtonText(intent)}
                    </CreditCard>
                    <div style={{height: "48px", float: "right"}}>
                        <div style={{paddingTop: "12px", height: "24px", paddingRight: "24px"}}>
                            <input type="checkbox" id="savePayment" checked={storePayment} onChange={(e) => {
                                setStorePayment(e.target.checked)
                            }}/>
                            <label htmlFor="savePayment">
                                Save Payment For Future Orders?
                            </label>
                        </div>
                    </div>
                </div>
                <div key={PAYMENT_TYPES.STORED_CARD.key}>
                    <StoredCards cardsOnFile={props.squareInfo.cardsOnFile}/>
                </div>
                <div key={PAYMENT_TYPES.GIFT_CARD.key}>
                    <GiftCardInput handleSubmit={gan => {
                        return payOrderViaGiftCard.send(makePostJSON({
                            orderAppAlias: props.orderAppAlias,
                            GAN: gan,
                            partialPayment: false
                        }))
                    }}/>
                </div>
                <div key={PAYMENT_TYPES.APPLE_PAY.key}>
                    <ApplePay/>
                </div>
                <div key={PAYMENT_TYPES.GOOGLE_PAY.key}>
                    <GooglePay/>
                </div>
            </TabGroup>
    </PaymentForm>
}