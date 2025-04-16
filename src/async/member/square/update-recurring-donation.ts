import * as t from 'io-ts';
import APIWrapper from 'core/APIWrapper';
import { HttpMethod } from "core/HttpMethod";
import { DonationPurchaseData, RecurringDonationData } from './get-recurring-donations';

export const validator = t.type({
    orderAppAlias: t.string,
    data: DonationPurchaseData,
    recurringDonationId: t.number,
    updatePayment: t.boolean
})

const resultValidator = RecurringDonationData

export type APIConstants = t.TypeOf<typeof resultValidator>

const path = "/member/update-recurring-donation"

export const getWrapper = new APIWrapper<typeof resultValidator, t.TypeOf<typeof validator>, {}>({
    path,
    type: HttpMethod.POST,
    resultValidator
})