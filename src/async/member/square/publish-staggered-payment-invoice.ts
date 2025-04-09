import * as t from 'io-ts';
import APIWrapper from 'core/APIWrapper';
import { HttpMethod } from "core/HttpMethod";

export const validator = t.type({
    orderAppAlias: t.string,
    invoiceId: t.string
})

const resultValidator = t.boolean

export type APIConstants = t.TypeOf<typeof resultValidator>

const path = "/member/publish-staggered-payment-invoice"

export const getWrapper = new APIWrapper<typeof resultValidator, t.TypeOf<typeof validator>, {}>({
    path,
    type: HttpMethod.POST,
    resultValidator
})