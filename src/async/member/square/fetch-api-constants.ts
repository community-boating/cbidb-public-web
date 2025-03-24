import * as t from 'io-ts';
import APIWrapper from 'core/APIWrapper';
import { HttpMethod } from "core/HttpMethod";

export const validator = t.type({})

const resultValidator = t.type({
    squareApplicationId: t.string,
    squareLocationId: t.string,
    googlePlaceAPIKey: t.string
})

export type APIConstants = t.TypeOf<typeof resultValidator>

const path = "/member/fetch-api-constants"

export const getWrapper = new APIWrapper<typeof resultValidator, t.TypeOf<typeof validator>, {}>({
    path,
    type: HttpMethod.GET,
    resultValidator
})