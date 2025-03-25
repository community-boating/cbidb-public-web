import * as t from 'io-ts';
import APIWrapper from 'core/APIWrapper';
import { HttpMethod } from "core/HttpMethod";
import { OptionalString } from 'util/OptionalTypeValidators';
import { Money } from './upsert-compass-order';

export const validator = t.type({})

export const SquareGiftCard = t.type({
    id: t.string,
    ganSource: t.literal('OTHER'),
    type: t.union([t.literal('DIGITAL'), t.literal('PHYSICAL')]),
    balanceMoney: Money, // ISO currency code (e.g., 'USD')
    createdAt: t.string, // ISO date string
    updatedAt: t.union([t.string,t.undefined]), // ISO date string
    state: t.union([t.literal('ACTIVE'), t.literal('INACTIVE'), t.literal('EXPIRED')]),
  });

export type SquareGiftCard = t.TypeOf<typeof SquareGiftCard>

export const SquareCard = t.type({
    id: t.string,
    cardBrand: t.string,
    last4: t.string,
    expMonth: t.number,
    expYear: t.number,
    cardholderName: t.union([t.string, t.null]),
    billingAddress: t.union([
      t.type({
        addressLine1: t.union([t.string, t.null]),
        addressLine2: t.union([t.string, t.null]),
        addressLine3: t.union([t.string, t.null]),
        locality: t.union([t.string, t.null]),
        administrativeDistrictLevel1: t.union([t.string, t.null]),
        postalCode: t.union([t.string, t.null]),
        country: t.union([t.string, t.undefined]),
      }),
      t.null,
    ]),
    fingerprint: t.union([t.string, t.null]),
  })

export const billingContactValidator = t.type({
    "givenName": OptionalString,
    "familyName": OptionalString,
    "email": t.string,
    "phone": OptionalString,
    "addressLines": t.array(t.string),
    "city": OptionalString,
    "state": OptionalString,
    "country": OptionalString
})

const resultValidator = t.type({
    squareCustomerId: t.string,
    verificationDetails: t.type({
        amountOverride: OptionalString,
        billingContact: billingContactValidator,
        "currencyCode": t.string,
        "intentOverride": OptionalString,
        "customerInitiatedOverride": OptionalString,
        "sellerKeyedInOverride": OptionalString
    }),
    cardsOnFile: t.array(SquareCard)
})

export type SquareCustomerInfo = t.TypeOf<typeof resultValidator>

export type SquareCard = t.TypeOf<typeof SquareCard>

const path = "/member/upsert-square-customer"

export const getWrapper = new APIWrapper<typeof resultValidator, t.TypeOf<typeof validator>, {}>({
    path,
    type: HttpMethod.POST,
    resultValidator
})