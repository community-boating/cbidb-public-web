import * as t from 'io-ts';
import APIWrapper from 'core/APIWrapper';
import { HttpMethod } from "core/HttpMethod";

export const validator = t.type({
	firstName: t.string,
	lastName: t.string,
	emailAddress: t.string,
	dob: t.string,
	phonePrimary: t.string,
	phonePrimaryType: t.string,
	emerg1Name: t.string,
	emerg1Relation: t.string,
	emerg1PhonePrimary: t.string,
	emerg1PhonePrimaryType: t.string,
	previousMember: t.boolean,
	forRental: t.boolean,
});

export const responseValidator = t.type({
	cardAssignID: t.number,
	cardNumber: t.number,
	ticketHTML: t.string
})

const path = "/ap/create-ap-guest"

export const postWrapper = new APIWrapper({
	path,
	type: HttpMethod.POST,
	resultValidator: responseValidator,
	postBodyValidator: validator,
	fixedParams: {}
})