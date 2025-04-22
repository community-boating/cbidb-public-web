import { CardDetails, ChargeVerifyBuyerDetails, PaymentRequestOptions, StoreVerifyBuyerDetails, TokenResult, VerifyBuyerResponseDetails } from "@square/web-payments-sdk-types"
import { APIConstants } from "async/member/square/fetch-api-constants"
import { SquareOrderInfo } from "async/member/square/upsert-compass-order"
import { SquareCard, SquareCustomerInfo } from "async/member/square/upsert-square-customer"
import { postWrapper as storeCard } from "async/member/square/store-card"
import * as React from "react"
import { ApplePay, CreditCard, GooglePay, PaymentForm } from "react-square-web-payments-sdk"
import { makePostJSON } from "core/APIWrapperUtil"
import { none, Option, some } from "fp-ts/lib/Option"
import {getWrapper as publishInvoice} from "async/member/square/create-staggered-payment-invoice"
import {postWrapper as payOrderViaPaymentSource} from "async/member/square/pay-order-via-payment-source"
import {postWrapper as payOrderFree} from "async/member/square/pay-order-free"
import { postWrapper as pollOrderStatus } from "async/member/square/poll-order-status"
import { getWrapper as upsertCompassOrderAPI } from "async/member/square/upsert-compass-order"
import { getWrapper as upsertSquareCustomerAPI } from "async/member/square/upsert-square-customer"
import { getWrapper as getAPIConstants } from "async/member/square/fetch-api-constants"
import { postWrapper as payRecurringDonations } from "async/member/square/pay-recurring-donations"
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
    setPaymentErrors: (errors: string[]) => void
    fetchOrderLate?: boolean
    updateInvoices?: boolean
    updateRecurringDonations?: boolean
}

export type IntentTypes = "CHARGE" | "CHARGE_AND_STORE" | "STORE"

function isIntentValid(intent: string): intent is IntentTypes {
    return ["CHARGE", "CHARGE_AND_STORE", "STORE"].contains(intent)
}

function convertMoneyToFloat(money: number){
    return String(money / 100)
}

function mapVertificationDetails(props: SquarePaymentFormProps, intent: IntentTypes): ChargeVerifyBuyerDetails | StoreVerifyBuyerDetails {
    const verificationInfo = props.squareInfo.verificationDetails
    const billingContact = verificationInfo.billingContact
    const orderPrice = props.order ? convertMoneyToFloat(props.order.squareOrderPriceInCents) : undefined
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
    if(props.order == undefined){
        return undefined
    }
    return {
        countryCode: props.squareInfo.verificationDetails.billingContact.country.getOrElse("US"),
        currencyCode: props.squareInfo.verificationDetails.currencyCode,
        total: {amount: convertMoneyToFloat(props.order.squareOrderPriceInCents), label:"Total"}
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

function isPaymentDisabled(props: SquarePaymentFormProps, paymentType: typeof PAYMENT_TYPES.CREDIT_CARD, cardsOnFileFiltered: SquareCard[]){
    switch(paymentType){
        case PAYMENT_TYPES.APPLE_PAY:
            if((window as any).ApplePaySession == undefined) return true
        case PAYMENT_TYPES.GOOGLE_PAY:
            return (props.order == undefined || props.order.compassOrderId == undefined)
        case PAYMENT_TYPES.CREDIT_CARD:
            return false
        case PAYMENT_TYPES.GIFT_CARD:
            return props.orderAppAlias == "GC"
        case PAYMENT_TYPES.STORED_CARD:
            return cardsOnFileFiltered.length == 0
    }
}

export function getPaymentPropsAsyncNoOrder(orderAppAlias: string): Promise<ApiResult<SquarePaymentFormPropsAsync>> {
    const orderAppAliasJson = makePostJSON({orderAppAlias})
    return Promise.all([upsertSquareCustomerAPI.send(orderAppAliasJson),
    getAPIConstants.send(orderAppAliasJson)]).then((async) => {
        if(async[0].type == "Success" && async[1].type == "Success"){
            return Promise.resolve({
                type: "Success",
                success: {
                    apiConstants: async[1].success,
                    squareInfo: async[0].success,
                    order: undefined
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
    const [deletedCardIds, setDeletedCardIds] = React.useState<string[]>([])
    const [addedCards, setAddedCards] = React.useState<SquareCard[]>([])
    const [order, setOrder] = props.fetchOrderLate ? React.useState(props.order) : [props.order, () => {}]
    const propsToUse = props.fetchOrderLate ? {...props, order: order} : props
    const setPaymentErrors = props.setPaymentErrors
    var effector = React.useRef<Promise<any>>()
    /*if(propsToUse.fetchOrderLate){
        React.useEffect(() => {
            effector.current = upsertCompassOrderAPI.send(makePostJSON({
                orderAppAlias: propsToUse.orderAppAlias
            })).then((a) => {
                if(a.type == "Success"){
                    setOrder(a.success)
                }else{
                    propsToUse.setPaymentErrors(["Failed to get order"])
                }
            })
        }, [])
    }*/
    const [defaultCardId, setDefaultCardId] = React.useState<string>(propsToUse.squareInfo.defaultCardId)
    const [paymentType, setPaymentType] = React.useState(PAYMENT_TYPES.CREDIT_CARD.key)
    const [buttonDisableOverride, setButtonDisableOverride] = React.useState(false)
    const [storePayment, setStorePayment] = React.useState(propsToUse.intentOverride == "STORE" || propsToUse.intentOverride == "CHARGE_AND_STORE")
    const [doPoll, setDoPoll] = React.useState(false)
    const pollingRef = React.useRef<NodeJS.Timeout>()
    React.useEffect(() => {
        if(doPoll){
            if(propsToUse.order == undefined){
                console.log("ORDER IS BLANK, PLEASE WAIT")
                setDoPoll(false)
                setButtonDisableOverride(false)
            }else if(propsToUse.order.compassOrderId == undefined || donationIsRecurring){
                console.log("WE ARE GOOD NOW")
                propsToUse.handleSuccess()
                setDoPoll(false)
                setButtonDisableOverride(false)
            }else{
                pollingRef.current = setInterval(() => {
                    pollOrderStatus.send(makePostJSON({
                        orderAppAlias: propsToUse.orderAppAlias,
                        compassOrderId: propsToUse.order.compassOrderId
                    })).then((a) => {
                        if(a.type == "Success" && a.success){
                            propsToUse.handleSuccess()
                            setDoPoll(false)
                            clearInterval(pollingRef.current)
                            setButtonDisableOverride(false)
                        }
                    })
                }, 2000)
            }
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

    const cardsOnFileFiltered = propsToUse.squareInfo.cardsOnFile.filter(card => !deletedCardIds.contains(card.id)).concat(addedCards)

    const donationIsRecurring = propsToUse.order && propsToUse.order.doRecurring

    const intentProvided = propsToUse.squareInfo.verificationDetails.intentOverride.getOrElse(propsToUse.intentOverride)
    const intent = donationIsRecurring ? "CHARGE_AND_STORE" : (isIntentValid(intentProvided) ? intentProvided : (storePayment ? "CHARGE_AND_STORE" : "CHARGE"))

    const verificationDetails = mapVertificationDetails(propsToUse, intent)
    console.log(propsToUse)
    const paymentRequest = mapPaymentRequest(propsToUse, intent)
    const showOnlyRecurring = (intent == "STORE" || intentProvided == "CHARGE_AND_STORE" || donationIsRecurring)
    const tabGroupsMapped = Object.values(PAYMENT_TYPES).map(paymentType => ({...paymentType, disabled: isPaymentDisabled(propsToUse, paymentType, cardsOnFileFiltered)}))
    .filter((a) => (a.key == PAYMENT_TYPES.CREDIT_CARD.key || a.key == PAYMENT_TYPES.STORED_CARD.key || !showOnlyRecurring))
    const isFree = order && order.squareOrderPriceInCents == 0 && order.staggeredSquareOrderPriceInCents == 0
    const isLoading = props.fetchOrderLate && propsToUse.order == undefined
    const isPaymentAvailable = !isLoading && !buttonDisableOverride
    console.log(paymentRequest)
    const doCharge = (sourceId: string, verificationTokenOpt: Option<string> = none) => {
        if(!isPaymentAvailable){
            propsToUse.setPaymentErrors(["Payment is loading, please wait"])
            return Promise.reject()
        }

        if(donationIsRecurring){
            return payRecurringDonations.send(makePostJSON({
                orderAppAlias: propsToUse.orderAppAlias,
                cardId: sourceId
            })).then((a) => {
                if(a.type == "Success"){
                    return Promise.resolve()
                }else{
                    setPaymentErrors(["Failed to pay for recurring donation"])
                }
                return Promise.reject()
            })
        }

        const payOrderNonStaggered = order.compassOrderId != undefined ? payOrderViaPaymentSource.send(makePostJSON({
            orderAppAlias: propsToUse.orderAppAlias,
            paymentSourceId: sourceId,
            partialPayment: false,
            verificationToken: verificationTokenOpt
        })) : Promise.resolve(undefined)
        const payOrderStaggered = order.staggeredCompassOrderId != undefined ? publishInvoice.send(makePostJSON({
            orderAppAlias: propsToUse.orderAppAlias,
            staggeredCompassOrderId: order.staggeredCompassOrderId,
            cardId: sourceId
        })) : Promise.resolve(undefined)
        return Promise.all([payOrderStaggered, payOrderNonStaggered]).then((a) => {
            if(a[0] != undefined){
                if(a[0].type != "Success"){
                    setPaymentErrors(["Payment failed, please try again later. If the issue keeps happening please send us an email and we will fix the problem as soon as we can"])
                    return Promise.reject()
                }
            }
            if(a[1] != undefined){
                if(a[1].type != "Success"){
                    setPaymentErrors(["Payment failed, please try again later. If the issue keeps happening please send us an email and we will fix the problem as soon as we can"])
                    return Promise.reject()
                }
            }
            return Promise.resolve()
        })
    }


    const handleResult = (promise: Promise<any>) => {
        return promise.then(() => {
            console.log("SETTING POLL ENABLED")
            setDoPoll(true)
        }).catch(e => {
            console.log("Error processing payment", e)
            //setPaymentErrors(["Error handling payment"])
        }).finally(() => {
            setButtonDisableOverride(false)
        })
    }


    if(isFree)
        return <FactaButton forceSpinner={doPoll} text="Your order is free! Click to complete it now" spinnerOnClick onClick={() => {
            if(!isPaymentAvailable){
                propsToUse.setPaymentErrors(["Payment is loading, please wait"])
                return Promise.resolve()
            }
            return payOrderFree.send(makePostJSON({
                orderAppAlias: propsToUse.orderAppAlias
            })).then((a) => {
                if(a.type == "Success"){
                    setDoPoll(true)
                }else{
                    console.log("Failed to pay for order", a)
                    setPaymentErrors(["Payment Error, please contact staff at CBI"])
                }
            })
        }}/>  
    return <PaymentForm applicationId={propsToUse.apiConstants.squareApplicationId} locationId={propsToUse.apiConstants.squareLocationId} cardTokenizeResponseReceived={function (result: TokenResult, verifiedBuyer?: VerifyBuyerResponseDetails | null): void {
        if(result.errors == null && result.token != null && paymentType != PAYMENT_TYPES.GIFT_CARD.key){

            setButtonDisableOverride(true)

            const verificationTokenOpt = (verifiedBuyer && verifiedBuyer.token) ? some(verifiedBuyer.token) : none

            const doStore = (card: CardDetails) => {
                return storeCard.send(makePostJSON({
                    orderAppAlias: propsToUse.orderAppAlias,
                    sourceId: result.token,
                    cardToSave: card as any,
                    verificationToken: verificationTokenOpt,
                    updateInvoices: propsToUse.updateInvoices == true,
                    updateRecurringDonations: propsToUse.updateRecurringDonations == true,
                    setAsDefault: true
                })).then((a) => {
                    if(a.type == "Success"){    
                        setAddedCards(cards => cards.concat(a.success.card))
                        return Promise.resolve(a.success)
                    }else{
                        setPaymentErrors(["Failed to store card, please try again and if the issue persists use the 'Report a Bug' button below to notify staff. We will fix the problem as soon as we are able"])
                        return Promise.reject()    
                    }
                })
            }
            
            if(intent == "CHARGE"){
                handleResult(doCharge(result.token, verificationTokenOpt))
            }else{
                if(paymentType == PAYMENT_TYPES.CREDIT_CARD.key && result.details && result.details.card){
                    const card = result.details.card
                    if(intent == "CHARGE_AND_STORE"){
                        handleResult(doStore(card).then((a) => {
                            return doCharge(a.card.id)
                            }
                        ))
                    }else{
                        handleResult(doStore(card))
                    }
                }else{
                    handleResult(doCharge(result.token, verificationTokenOpt))
                }
            }
        }else{
            setButtonDisableOverride(false)
        }
    }} createVerificationDetails={() => verificationDetails} createPaymentRequest={() => {return paymentRequest}}>
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
                    <StoredCards orderAppAlias={propsToUse.orderAppAlias} intent={intent} defaultCardId={defaultCardId} cardsOnFile={cardsOnFileFiltered} setErrors={setPaymentErrors} setDeletedCardIds={setDeletedCardIds} setDefaultCardId={setDefaultCardId} updateInvoices={propsToUse.updateInvoices == true} updateRecurringDonations={propsToUse.updateRecurringDonations == true} payWithCard={cardId => {
                        return handleResult(doCharge(cardId))
                    }}/>
                </div>
                <div key={PAYMENT_TYPES.GIFT_CARD.key}>
                    <GiftCardInput orderAppAlias={propsToUse.orderAppAlias} handleSubmit={cardId => {
                        return handleResult(doCharge(cardId))
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