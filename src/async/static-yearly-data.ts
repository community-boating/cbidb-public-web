
import * as t from 'io-ts';
import APIWrapper from 'core/APIWrapper';
import { HttpMethod } from "core/HttpMethod";

const path = "/static-yearly-data"

// TODO: shouldnt be jscon
export const apiw = new APIWrapper({
	path,
	type: HttpMethod.GET,
	resultValidator: t.type({
		data: t.type({
			rows: t.array(t.array(t.any))
		})
	}),
})