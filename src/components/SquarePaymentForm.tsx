import { CardDetails, ChargeVerifyBuyerDetails, PaymentRequestOptions, StoreVerifyBuyerDetails, TokenResult, VerifyBuyerResponseDetails } from "@square/web-payments-sdk-types"
import { APIConstants } from "async/member/square/fetch-api-constants"
import { SquareOrderInfo } from "async/member/square/upsert-compass-order"
import { SquareCustomerInfo } from "async/member/square/upsert-square-customer"
import { postWrapper as storeCard } from "async/member/square/store-card"
import * as React from "react"
import { ApplePay, CreditCard, GooglePay, PaymentForm } from "react-square-web-payments-sdk"
import { makePostJSON } from "core/APIWrapperUtil"
import { none, some } from "fp-ts/lib/Option"
import {postWrapper as payOrderViaPaymentSource} from "async/member/square/pay-order-via-payment-source"
import {postWrapper as payOrderFree} from "async/member/square/pay-order-free"
import { postWrapper as pollOrderStatus } from "async/member/square/poll-order-status"
import { getWrapper as upsertCompassOrderAPI } from "async/member/square/upsert-compass-order"
import { getWrapper as upsertSquareCustomerAPI } from "async/member/square/upsert-square-customer"
import { getWrapper as getAPIConstants } from "async/member/square/fetch-api-constants"
import TabGroup from "./TabGroup"
import StoredCards from "./StoredCards"
import GiftCardInput from "./GiftCardInput"
import FactaButton from "theme/facta/FactaButton"
import { ApiResult } from "core/APIWrapperTypes"

export type SquarePaymentFormPropsAsync = {
    apiConstants: APIConstants
    squareInfo: SquareCustomerInfo
    order?: SquareOrderInfo
}

export type SquarePaymentFormProps = SquarePaymentFormPropsAsync & {
    intentOverride?: string
    orderAppAlias: string
    handleSuccess: () => void
}

type IntentTypes = "CHARGE" | "CHARGE_AND_STORE" | "STORE"

function isIntentValid(intent: string): intent is IntentTypes {
    return ["CHARGE", "CHARGE_AND_STORE", "STORE"].contains(intent)
}

function convertMoneyToFloat(money: number){
    return String(money / 100)
}

function mapVertificationDetails(props: SquarePaymentFormProps, intent: IntentTypes): ChargeVerifyBuyerDetails | StoreVerifyBuyerDetails {
    Promise.all([])
    const verificationInfo = props.squareInfo.verificationDetails
    const billingContact = verificationInfo.billingContact
    const orderPrice = props.order ? convertMoneyToFloat(props.order.squareOrder.netAmountDueMoney.amount) : undefined
    return {
        amount: verificationInfo.amountOverride.getOrElse(orderPrice),
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
    if(!props.order){
        return undefined    
    }
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
            if((window as any).ApplePaySession == undefined) return true
        case PAYMENT_TYPES.GOOGLE_PAY:
            return (!props.order)
        case PAYMENT_TYPES.CREDIT_CARD:
            return false
        case PAYMENT_TYPES.GIFT_CARD:
            return props.orderAppAlias == "GC"
        case PAYMENT_TYPES.STORED_CARD:
            return props.squareInfo.cardsOnFile.length == 0
    }
}

export function getPaymentPropsAsync(orderAppAlias: string): Promise<ApiResult<SquarePaymentFormPropsAsync>> {
    const orderAppAliasJson = makePostJSON({orderAppAlias})
    return Promise.all([upsertCompassOrderAPI.send(orderAppAliasJson),
    upsertSquareCustomerAPI.send(orderAppAliasJson),
    getAPIConstants.send(orderAppAliasJson)]).then((async) => {
        if(async[0].type == "Success" && async[1].type == "Success"){
            return Promise.resolve({
                type: "Success",
                success: {
                    apiConstants: async[2].type == "Success" ? async[2].success : undefined,
                    squareInfo: async[1].success,
                    order: async[0].success
                }
        })
        }else{
            console.log("Error loading", async)
            return Promise.resolve({
                type: "Failure"
            } as ApiResult<SquarePaymentFormPropsAsync>)
        }
    })
}

export default function SquarePaymentForm(props: SquarePaymentFormProps){
    const [paymentErrors, setPaymentErrors] = React.useState<string>(undefined)
    const [paymentType, setPaymentType] = React.useState(PAYMENT_TYPES.CREDIT_CARD.key)
    const [buttonDisableOverride, setButtonDisableOverride] = React.useState(false)
    const [storePayment, setStorePayment] = React.useState(props.intentOverride == "STORE" || props.intentOverride == "CHARGE_AND_STORE")
    const [doPoll, setDoPoll] = React.useState(false)
    const pollingRef = React.useRef<NodeJS.Timeout>()
    React.useEffect(() => {
        if(doPoll){
            pollingRef.current = setInterval(() => {
                pollOrderStatus.send(makePostJSON({
                    orderAppAlias: props.orderAppAlias,
                    compassOrderId: props.order.compassOrderId
                })).then((a) => {
                    if(a.type == "Success" && a.success){
                        props.handleSuccess()
                        setDoPoll(false)
                        clearInterval(pollingRef.current)
                        setButtonDisableOverride(false)
                    }
                })
            }, 2000)
        }else{
            if(pollingRef.current)
                clearInterval(pollingRef.current)
            pollingRef.current = undefined
        }
        return () => {
            if(pollingRef.current)
                clearInterval(pollingRef.current)
        }
    }, [doPoll])
    const intentProvided = props.squareInfo.verificationDetails.intentOverride.getOrElse(props.intentOverride)
    const intent = isIntentValid(intentProvided) ? intentProvided : (storePayment ? "CHARGE_AND_STORE" : "CHARGE")
    const verificationDetails = mapVertificationDetails(props, intent)
    const paymentRequest = mapPaymentRequest(props, intent)
    const showOnlyRecurring = (intent == "STORE" || intentProvided == "CHARGE_AND_STORE")
    const tabGroupsMapped = Object.values(PAYMENT_TYPES).map(paymentType => ({...paymentType, disabled: isPaymentDisabled(props, paymentType)}))
    .filter((a) => (a.key == PAYMENT_TYPES.CREDIT_CARD.key || a.key == PAYMENT_TYPES.STORED_CARD.key || !showOnlyRecurring))
    const isFree = props.order && props.order.squareOrder.netAmountDueMoney.amount == 0
    if(isFree)
        return <FactaButton forceSpinner={doPoll} text="Your order is free! Click to complete it now" spinnerOnClick onClick={() => {
            return payOrderFree.send(makePostJSON({
                orderAppAlias: props.orderAppAlias
            })).then((a) => {
                if(a.type == "Success"){
                    setDoPoll(true)
                }else{
                    console.log("Failed to pay for order", a)
                    setPaymentErrors("Payment Error, please contact staff at CBI")
                }
            })
        }}/>
    return <PaymentForm applicationId={props.apiConstants.squareApplicationId} locationId={props.apiConstants.squareLocationId} cardTokenizeResponseReceived={function (result: TokenResult, verifiedBuyer?: VerifyBuyerResponseDetails | null): void {
        if(result.errors == null && result.token != null && paymentType != PAYMENT_TYPES.GIFT_CARD.key){
            setButtonDisableOverride(true)
            const verificationTokenOpt = (verifiedBuyer && verifiedBuyer.token) ? some(verifiedBuyer.token) : none
            const doCharge = (sourceId: string) => {
                setDoPoll(true)
                return payOrderViaPaymentSource.send(makePostJSON({
                    orderAppAlias: props.orderAppAlias,
                    paymentSourceId: sourceId,
                    partialPayment: false,
                    //Token will be used by doStore, square will be angry if we try and reuse it
                    verificationToken: (intent != "CHARGE_AND_STORE") ? verificationTokenOpt : none
                }))
            }
            const doStore = (card: CardDetails) => {
                return storeCard.send(makePostJSON({
                    orderAppAlias: props.orderAppAlias,
                    sourceId: result.token,
                    cardToSave: card as any,
                    verificationToken: verificationTokenOpt
                }))
            }
            const handleResult = (promise: Promise<any>) => {
                promise.catch(e => {
                    console.log("Error processing payment", e)
                }).finally(() => {
                    (intent == "STORE") && setButtonDisableOverride(false)
                })
            }
            if(intent == "CHARGE"){
                handleResult(doCharge(result.token))
            }else{
                if(paymentType == PAYMENT_TYPES.CREDIT_CARD.key && result.details && result.details.card){
                    const card = result.details.card
                    if(intent == "CHARGE_AND_STORE"){
                        handleResult(doStore(card).then((a) => {
                                if(a.type == "Success")
                                        return doCharge(a.success.card.id)
                                    return Promise.reject()
                                }
                            ))
                    }else{
                        handleResult(doStore(card))
                    }
                }else{
                    handleResult(doCharge(result.token))
                }
            }
        }else{
            setButtonDisableOverride(false)
        }
    }} createVerificationDetails={() => verificationDetails} createPaymentRequest={() => paymentRequest}>
        { paymentErrors ? <h2>{paymentErrors}</h2> : <></> }
        <TabGroup tabGroups={tabGroupsMapped} locked={buttonDisableOverride} controlled={{tabKey: paymentType, setTabKey: setPaymentType}}>
            <div key={PAYMENT_TYPES.CREDIT_CARD.key}>
                <CreditCard buttonProps={{
                    isLoading: buttonDisableOverride
                }}>
                    {mapCardIntentToButtonText(intent)}
                    </CreditCard>
                    {(showOnlyRecurring) ? <p>* Your card will be stored by our payment processor Square for future purchases with us.</p> :
                    <div style={{height: "48px", float: "right"}}>
                        <div style={{paddingTop: "12px", height: "24px", paddingRight: "24px"}}>
                            <input type="checkbox" id="savePayment" checked={storePayment} onChange={(e) => {
                                setStorePayment(e.target.checked)
                            }}/>
                            <label htmlFor="savePayment">
                                Save Payment For Future Orders?
                            </label>
                        </div>
                    </div>}
                </div>
                <div key={PAYMENT_TYPES.STORED_CARD.key}>
                    <StoredCards orderAppAlias={props.orderAppAlias} cardsOnFile={props.squareInfo.cardsOnFile} payWithCard={cardId => {
                        return payOrderViaPaymentSource.send(makePostJSON({
                            orderAppAlias: props.orderAppAlias,
                            paymentSourceId: cardId,
                            partialPayment: false,
                            verificationToken: null
                        })).then(a => {
                            if(a.type == "Success")
                                setDoPoll(true)
                            else
                                setPaymentErrors("Payment failed, please try again")
                            setButtonDisableOverride(false)
                        })
                    }}/>
                </div>
                <div key={PAYMENT_TYPES.GIFT_CARD.key}>
                    <GiftCardInput orderAppAlias={props.orderAppAlias} handleSubmit={cardId => {
                        setButtonDisableOverride(true)
                        return payOrderViaPaymentSource.send(makePostJSON({
                            orderAppAlias: props.orderAppAlias,
                            paymentSourceId: cardId,
                            partialPayment: false,
                            verificationToken: null
                        })).then(a => {
                            if(a.type == "Success")
                                setDoPoll(true)
                            else
                                setPaymentErrors("Payment failed, please try again")
                            setButtonDisableOverride(false)
                        })
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