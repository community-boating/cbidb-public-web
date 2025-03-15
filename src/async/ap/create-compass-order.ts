import * as t from 'io-ts';
import APIWrapper from 'core/APIWrapper';
import { HttpMethod } from "core/HttpMethod";

export const validator = t.type({
})

const resultValidator = t.string

const path = "/ap/create-compass-order"

export const postWrapper = new APIWrapper<typeof resultValidator, t.TypeOf<typeof validator>, {}>({
    path,
    type: HttpMethod.POST,
    resultValidator,
    fixedParams: {}
})