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
	cardAssignID: t.number,
	cardNumber: t.number,
	barcode: t.string
})

const path = "/ap/create-ap-guest"

export const postWrapper = new APIWrapper<typeof responseValidator, t.TypeOf<typeof validator>, {}>({
	path,
	type: HttpMethod.POST,
	resultValidator: responseValidator,
	fixedParams: {}
})