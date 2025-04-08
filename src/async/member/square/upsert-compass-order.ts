import * as t from 'io-ts';
import APIWrapper from 'core/APIWrapper';
import { HttpMethod } from "core/HttpMethod";

export const validator = t.type({
    orderAppAlias: t.string
})

export const Money = t.type({
  amount: t.number,
  currency: t.string
})

const LineItem = t.type({
  quantity: t.string,
  uid: t.string,
  name: t.string,
  catalogObjectId: t.union([t.string, t.null]),
  catalogVersion: t.union([t.number, t.null]),
  variationName: t.union([t.string, t.null]),
  itemType: t.string,
  metadata: t.union([t.record(t.string, t.string), t.null]),
  basePriceMoney: Money,
  variationTotalPriceMoney: Money,
  grossSalesMoney: Money,
  totalTaxMoney: Money,
  totalDiscountMoney: Money,
  totalMoney: Money,
  totalServiceChargeMoney: Money
})

    const Discount = t.type({
    uid: t.string,
    name: t.string,
    percentage: t.union([t.string, t.null]),
    amountMoney: Money
  })
  
  const NetAmounts = t.type({
    totalMoney: Money,
    taxMoney: Money,
    discountMoney: Money,
    tipMoney: Money,
    serviceChargeMoney: Money
  })
  
  const Order = t.type({
    locationId: t.string,
    id: t.string,
    referenceId: t.string,
    source: t.type({ name: t.string }),
    customerId: t.string,
    lineItems: t.union([t.array(LineItem), t.null]),
    discounts: t.union([t.array(Discount), t.null]),
    netAmounts: NetAmounts,
    metadata: t.record(t.string, t.string),
    createdAt: t.string,
    updatedAt: t.string,
    state: t.string,
    version: t.number,
    totalMoney: Money,
    totalTaxMoney: Money,
    totalDiscountMoney: Money,
    totalTipMoney: Money,
    totalServiceChargeMoney: Money,
    netAmountDueMoney: Money
  })

export { Order }

const resultValidator = t.type({
    compassOrderId: t.union([t.number, t.null, t.undefined]),
    squareOrderPriceInCents: t.union([t.number, t.null, t.undefined]),
    staggeredCompassOrderId: t.union([t.number, t.null, t.undefined]),
    staggeredSquareOrderPriceInCents: t.union([t.number, t.null, t.undefined]),
    staggeredOrderInvoiceId: t.union([t.string, t.null, t.undefined])
})

export type SquareOrderInfo = t.TypeOf<typeof resultValidator>

const path = "/member/upsert-compass-order"

export const getWrapper = new APIWrapper<typeof resultValidator, t.TypeOf<typeof validator>, {}>({
    path,
    type: HttpMethod.POST,
    resultValidator
})