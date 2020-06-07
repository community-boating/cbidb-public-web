import * as t from 'io-ts';
import APIWrapper from '../../core/APIWrapper';
import { HttpMethod } from "../../core/HttpMethod";
import { OptionalString } from '../../util/OptionalTypeValidators';

export const resultValidator = t.type({
	defaultPaymentId: OptionalString
})

const path = "/stripe/get-recurring-info"

export const getWrapper = new APIWrapper<typeof resultValidator, {}, {}>({
	path,
	type: HttpMethod.GET,
	resultValidator: resultValidator
})