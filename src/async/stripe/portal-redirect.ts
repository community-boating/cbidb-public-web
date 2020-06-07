import * as t from 'io-ts';
import APIWrapper from '../../core/APIWrapper';
import { HttpMethod } from "../../core/HttpMethod";

const resultValidator = t.type({

})

export const path = "/stripe/portal-redirect"

export const postWrapper = new APIWrapper<typeof resultValidator, {}, {}>({
	path,
	type: HttpMethod.POST,
	resultValidator: resultValidator
})