import * as t from 'io-ts';
import APIWrapper from '@core/APIWrapper';
import { HttpMethod } from "@core/HttpMethod";

const path = "/stripe/clear-card"

export type PostType = {
	program: string
}

export const postWrapper = new APIWrapper<typeof t.string, PostType, {}>({
	path,
	type: HttpMethod.POST,
	resultValidator: t.string
})