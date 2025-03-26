import * as t from 'io-ts';
import APIWrapper from 'core/APIWrapper';
import { HttpMethod } from "core/HttpMethod";
import { SquareGiftCard } from './upsert-square-customer';


export const validator = t.type({
    orderAppAlias: t.string,
    GAN: t.string
})

const resultValidator = t.type({
    squareGiftCard: SquareGiftCard
})

const path = "/member/get-square-gift-card-info"

export const postWrapper = new APIWrapper<typeof resultValidator, t.TypeOf<typeof validator>, {}>({
    path,
    type: HttpMethod.POST,
    resultValidator
})