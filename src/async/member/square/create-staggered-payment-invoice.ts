import * as t from 'io-ts';
import APIWrapper from 'core/APIWrapper';
import { HttpMethod } from "core/HttpMethod";

export const validator = t.type({
    orderAppAlias: t.string,
    staggeredCompassOrderId: t.number,
    cardId: t.union([t.string, t.null, t.undefined])
})

const resultValidator = t.boolean

export type APIConstants = t.TypeOf<typeof resultValidator>

const path = "/member/create-staggered-payment-invoice"

export const getWrapper = new APIWrapper<typeof resultValidator, t.TypeOf<typeof validator>, {}>({
    path,
    type: HttpMethod.POST,
    resultValidator
})