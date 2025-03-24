import * as t from 'io-ts';
import APIWrapper from 'core/APIWrapper';
import { HttpMethod } from "core/HttpMethod";


export const validator = t.type({
    GAN: t.string
})

const SquareGiftCard = t.type({
    id: t.string,
    type: t.literal('gift_card'),
    balance: t.number, // Assuming balance is stored as a number (e.g., cents)
    currency: t.string, // ISO currency code (e.g., 'USD')
    createdAt: t.string, // ISO date string
    updatedAt: t.string, // ISO date string
    status: t.union([t.literal('ACTIVE'), t.literal('INACTIVE'), t.literal('EXPIRED')]),
  });

const resultValidator = t.type({
    squareGiftCard: SquareGiftCard
})

const path = "/member/get-square-gift-card-info"

export const postWrapper = new APIWrapper<typeof resultValidator, t.TypeOf<typeof validator>, {}>({
    path,
    type: HttpMethod.POST,
    resultValidator
})