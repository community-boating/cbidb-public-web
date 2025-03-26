import * as t from 'io-ts';
import APIWrapper from 'core/APIWrapper';
import { HttpMethod } from "core/HttpMethod";
import { OptionalString } from 'util/OptionalTypeValidators';

export const validator = t.type({
    orderAppAlias: t.string,
    paymentSourceId: t.string,
    partialPayment: t.boolean,
    verificationToken: OptionalString
})

const resultValidator = t.type({
    amountLeft: t.number
})

const path = "/member/pay-order-by-payment-source"

export const postWrapper = new APIWrapper<typeof resultValidator, t.TypeOf<typeof validator>, {}>({
    path,
    type: HttpMethod.POST,
    resultValidator
})