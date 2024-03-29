import * as t from 'io-ts';
import APIWrapper from 'core/APIWrapper';
import { HttpMethod } from "core/HttpMethod";

export const weekValidator = t.type({
	weekNumber: t.number,
	weekTitle: t.string,
	monday: t.string,
	friday: t.string
})

export type Week = t.TypeOf<typeof weekValidator>

export const weeksValidator = t.array(weekValidator)

const path = "/weeks"

export const apiw = new APIWrapper({
	path,
	type: HttpMethod.GET,
	resultValidator: weeksValidator,
})