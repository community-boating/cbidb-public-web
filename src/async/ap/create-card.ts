import * as t from 'io-ts';
import APIWrapper from '@core/APIWrapper';
import { HttpMethod } from "@core/HttpMethod";

export const validator = t.type({
	personID: t.number,
})

export const responseValidator = t.type({
	cardAssignID: t.number,
    cardNumber: t.number
})

const path = "/fo-kiosk/create-card"

export const postWrapper = new APIWrapper<typeof responseValidator, t.TypeOf<typeof validator>, {}>({
	path,
	type: HttpMethod.POST,
	resultValidator: responseValidator,
	fixedParams: {}
})