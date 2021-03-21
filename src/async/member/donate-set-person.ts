import * as t from 'io-ts';
import APIWrapper from '../../core/APIWrapper';
import { HttpMethod } from "../../core/HttpMethod";
import { OptionalString } from '../../util/OptionalTypeValidators';

export const validator = t.type({
	nameFirst: OptionalString,
	nameLast: OptionalString,
	email: OptionalString,
})

const resultValidator = t.type({success: t.boolean})

const path = "/member/donate-set-person"


export const postWrapper = new APIWrapper<typeof resultValidator, t.TypeOf<typeof validator>, {}>({
	path,
	type: HttpMethod.POST,
	resultValidator,
	fixedParams: {}
})