import * as t from 'io-ts';
import { PageFlavor } from '../components/Page';
import APIWrapper from '../core/APIWrapper';
import { HttpMethod } from "../core/HttpMethod";
import { OptionalString, OptionalNumber } from '../util/OptionalTypeValidators';

export const cartItemValidator = t.type({
	itemNameHTML: t.string,
	itemId: t.number,
	itemType: t.string,
	nameFirst: OptionalString,
	nameLast: OptionalString,
	price: t.number,
	displayOrder: t.number,
	orderId: t.number,
	fundId: OptionalNumber
});

export const cartItemValidatorList = t.array(cartItemValidator);

export type CartItem = t.TypeOf<typeof cartItemValidator>

const path = "/get-cart-items"

export const apiw = (program: PageFlavor) =>new APIWrapper({
	path: path + "?program=" + program,
	type: HttpMethod.GET,
	resultValidator: cartItemValidatorList,
})