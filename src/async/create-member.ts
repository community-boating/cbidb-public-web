import * as t from 'io-ts';
import APIWrapper from '@core/APIWrapper';
import { HttpMethod } from "@core/HttpMethod";

const path = "/create-member"

const validator = t.type({
	username: t.string,
	password: t.string,
	firstName: t.string,
	lastName: t.string
})

const responseValidator = t.type({
	personId: t.number
})

export const postWrapper = new APIWrapper<typeof responseValidator, t.TypeOf<typeof validator>, {}>({
	path,
	type: HttpMethod.POST,
	resultValidator: responseValidator
})

