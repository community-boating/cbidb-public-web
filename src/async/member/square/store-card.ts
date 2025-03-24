import * as t from 'io-ts';
import APIWrapper from 'core/APIWrapper';
import { HttpMethod } from "core/HttpMethod";
import { SquareCard } from './upsert-square-customer';
import { OptionalString } from 'util/OptionalTypeValidators';

export const validator = t.type({
    sourceId: t.string,
    cardToSave: SquareCard,
    verificationToken: OptionalString
})
  

const resultValidator = t.boolean

const path = "/member/store-square-card"

export const postWrapper = new APIWrapper<typeof resultValidator, t.TypeOf<typeof validator>, {}>({
    path,
    type: HttpMethod.POST,
    resultValidator
})