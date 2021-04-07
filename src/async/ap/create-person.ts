import * as t from 'io-ts';
import APIWrapper from '@core/APIWrapper';
import { HttpMethod } from "@core/HttpMethod";

export const validator = t.type({
	firstName: t.string,
	lastName: t.string,
	emailAddress: t.string,
	dob: t.string,
	phonePrimary: t.string,
	emerg1Name: t.string,
    emerg1Relation: t.string,
    emerg1PhonePrimary: t.string,
    previousMember: t.boolean
})

export const responseValidator = t.type({
	personID: t.number
})

const path = "/fo-kiosk/create-person"

export const postWrapper = new APIWrapper<typeof responseValidator, t.TypeOf<typeof validator>, {}>({
	path,
	type: HttpMethod.POST,
	resultValidator: responseValidator,
	fixedParams: {}
})