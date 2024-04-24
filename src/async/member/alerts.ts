import * as t from 'io-ts';
import APIWrapper from 'core/APIWrapper';
import { HttpMethod } from "core/HttpMethod";

export const alertMethodsValidator = t.type({
	email: t.boolean
});

export const alertEventsValidator = t.type({
	redAp: alertMethodsValidator,
	yellowAp: alertMethodsValidator
})

const path = "/member/alerts"

export const getWrapper = new APIWrapper({
	path: path,
	type: HttpMethod.GET,
	resultValidator: alertEventsValidator,
})

export const postWrapper = new APIWrapper({
	path,
	type: HttpMethod.POST,
	resultValidator: alertEventsValidator,
	postBodyValidator: alertEventsValidator,
	fixedParams: {}
})
