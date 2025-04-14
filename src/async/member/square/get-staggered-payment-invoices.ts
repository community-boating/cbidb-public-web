import * as t from 'io-ts';
import APIWrapper from 'core/APIWrapper';
import { HttpMethod } from "core/HttpMethod";

export const StaggeredPaymentChargeData = t.type({
    staggerPricePaid: t.union([t.number, t.null, t.undefined]),
    staggerPrice: t.number,
    extraPrice: t.union([t.number, t.null, t.undefined]),
    staggerSeq: t.number,
    staggerId: t.union([t.number, t.null, t.undefined]),
    paymentDueDate: t.string,
    paid: t.union([t.string, t.null, t.undefined]),
    cronError: t.union([t.string, t.null, t.undefined]),
    squareInvoiceId: t.union([t.string, t.null, t.undefined])
})

export const validator = t.type({
    orderAppAlias: t.string,
    membershipPersonId: t.union([t.number, t.null, t.undefined])
})

const resultValidator = t.type({
    invoices: t.array(t.array(StaggeredPaymentChargeData))
})

export type APIConstants = t.TypeOf<typeof resultValidator>

const path = "/member/get-staggered-payment-invoices"

export const getWrapper = new APIWrapper<typeof resultValidator, t.TypeOf<typeof validator>, {}>({
    path,
    type: HttpMethod.POST,
    resultValidator
})