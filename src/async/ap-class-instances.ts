import * as t from 'io-ts';
import APIWrapper from 'core/APIWrapper';
import { HttpMethod } from "core/HttpMethod";

const path = "/ap-class-instances"

export const apiw = (startDate: string) =>new APIWrapper({
	path: path + "?startDate=" + startDate,
	type: HttpMethod.GET,
	resultValidator: t.any,
})