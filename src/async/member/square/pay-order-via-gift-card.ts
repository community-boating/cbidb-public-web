import * as t from 'io-ts';
import APIWrapper from 'core/APIWrapper';
import { HttpMethod } from "core/HttpMethod";

export const validator = t.type({
    orderAppAlias: t.string,
    GAN: t.string,
    partialPayment: t.boolean
})

const resultValidator = t.type({
    amountLeft: t.number
})

const path = "/member/pay-order-by-gift-card"

export const postWrapper = new APIWrapper<typeof resultValidator, t.TypeOf<typeof validator>, {}>({
    path,
    type: HttpMethod.POST,
    resultValidator
})