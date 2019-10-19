import * as t from 'io-ts';
import APIWrapper from '../../core/APIWrapper';
import { HttpMethod } from "../../core/HttpMethod";

export type PostType = {
	token: string,
	orderId: number
}

const path = "/stripe/store-token"

export const postWrapper = new APIWrapper<typeof t.any, PostType, {}>({
	path,
	type: HttpMethod.POST,
	resultValidator: t.any
})