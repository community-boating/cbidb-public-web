import * as t from 'io-ts';
import APIWrapper from 'core/APIWrapper';
import { HttpMethod } from "core/HttpMethod";
import { OptionalString } from 'util/OptionalTypeValidators';

export const validator = t.type({
	swimProofId: OptionalString
})

const path = "/junior/swim-proof"

export const getWrapper = (personId: number) => new APIWrapper({
	path: path + "?personId=" + personId,
	type: HttpMethod.GET,
	resultValidator: validator
})

export const postWrapper = (personId: number) => new APIWrapper({
	path,
	type: HttpMethod.POST,
	resultValidator: t.string,
	postBodyValidator: validator,
	fixedParams: {personId}
})