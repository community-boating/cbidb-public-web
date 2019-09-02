import * as t from 'io-ts';
import APIWrapper from '../../core/APIWrapper';
import { HttpMethod } from "../../core/HttpMethod";

export const validator = t.array(t.type({
	typeId: t.number,
	canSee: t.boolean
}))

const path = "/junior/see-types"

export const getWrapper = (personId: number) => new APIWrapper<typeof validator, {}, {}>({
	path: path + "?personId=" + personId,
	type: HttpMethod.GET,
	resultValidator: validator
})
