import * as t from 'io-ts';
import APIWrapper from '../../core/APIWrapper';
import { HttpMethod } from "../../core/HttpMethod";
import { OptionalNumber } from '../../util/OptionalTypeValidators';

export const validator = t.type({
	swimProofId: OptionalNumber
})

const path = "/junior/swim-proof"

export const getWrapper = (personId: number) => new APIWrapper<typeof validator, {}, {}>({
	path: path + "?personId=" + personId,
	type: HttpMethod.GET,
	resultValidator: validator
})

export const postWrapper = (personId: number) => new APIWrapper<typeof t.string, t.TypeOf<typeof validator>, {personId: number}>({
	path,
	type: HttpMethod.POST,
	resultValidator: t.string,
	fixedParams: {personId}
})