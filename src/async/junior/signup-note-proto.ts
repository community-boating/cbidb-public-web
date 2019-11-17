import * as t from 'io-ts';
import APIWrapper from '../../core/APIWrapper';
import { HttpMethod } from "../../core/HttpMethod";
import { OptionalString } from '../../util/OptionalTypeValidators';
import { none, Option } from 'fp-ts/lib/Option';


export const validator = t.type({
	juniorId: t.number,
	instanceId: t.number,
	signupNote: OptionalString
})

const path = "/junior/signup-note-proto"

// export const getWrapper = (juniorId: number, instanceId: number) => new APIWrapper<typeof validator, {}, {}>({
// 	path: path + `?juniorId=${juniorId}&instanceId=${instanceId}`,
// 	type: HttpMethod.GET,
// 	resultValidator: validator
// })

export const postWrapper = new APIWrapper<typeof validator, t.TypeOf<typeof validator>, {}>({
	path,
	type: HttpMethod.POST,
	resultValidator: validator,
	fixedParams: { }
})