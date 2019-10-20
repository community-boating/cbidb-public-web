import * as t from 'io-ts';
import APIWrapper from '../../core/APIWrapper';
import { HttpMethod } from "../../core/HttpMethod";
import { type } from 'os';

const path = "/stripe/submit-payment"

export const postWrapper = new APIWrapper({
	path,
	type: HttpMethod.POST,
	resultValidator: t.type({
		successAttemptId: t.number
	})
})