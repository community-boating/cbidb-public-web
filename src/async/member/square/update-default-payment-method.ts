import * as t from 'io-ts';
import APIWrapper from 'core/APIWrapper';
import { HttpMethod } from "core/HttpMethod";

export const validator = t.type({
    orderAppAlias: t.string,
    defaultCardId: t.string,
})
  

const resultValidator = t.boolean

const path = "/member/update-default-payment-method"

export const postWrapper = new APIWrapper<typeof resultValidator, t.TypeOf<typeof validator>, {}>({
    path,
    type: HttpMethod.POST,
    resultValidator
})