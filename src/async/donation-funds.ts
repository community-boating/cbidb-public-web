import * as t from 'io-ts';
import APIWrapper from '@core/APIWrapper';
import { HttpMethod } from "@core/HttpMethod";

const path = "/donation-funds"

export const donationFundValidator = t.type({
	fundId: t.number,
	fundName: t.string,
	portalDescription: t.string,
	isEndowment: t.boolean
})

export const validator = t.array(donationFundValidator)

export const getWrapper = new APIWrapper({
	path,
	type: HttpMethod.GET,
	resultValidator: validator,
})
