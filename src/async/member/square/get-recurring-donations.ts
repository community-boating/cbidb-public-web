import * as t from 'io-ts';
import APIWrapper from 'core/APIWrapper';
import { HttpMethod } from "core/HttpMethod";

export const DonationPurchaseData = t.type({
    price: t.number,
    fundId: t.union([t.number, t.null, t.undefined]),
    inMemoryOf: t.union([t.string, t.null, t.undefined]),
    donationDateTime: t.union([t.string, t.null, t.undefined]),
    personId: t.union([t.number, t.null, t.undefined])
})

export const RecurringDonationData = t.type({
    recurringDonationId: t.number,
    donationData: DonationPurchaseData,
    templateCompassOrderId: t.union([t.number, t.null, t.undefined]),
    subscriptionId: t.union([t.string, t.null, t.undefined]),
    isPaused: t.union([t.string, t.null, t.undefined])
})

export const validator = t.type({
    orderAppAlias: t.string
})

export const resultValidator = t.type({
    recurringDonations: t.array(RecurringDonationData)
})

export type APIConstants = t.TypeOf<typeof resultValidator>

const path = "/member/get-recurring-donations"

export const getWrapper = new APIWrapper<typeof resultValidator, t.TypeOf<typeof validator>, {}>({
    path,
    type: HttpMethod.POST,
    resultValidator
})