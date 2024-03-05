import * as t from 'io-ts';
import APIWrapper from 'core/APIWrapper';
import { HttpMethod } from "core/HttpMethod";

export function EnumType<T extends {[key: string]: any}>(name: string, e: T){
	const revEnum: {[key: string]: any} = {};
	Object.entries(e).forEach((a) => {
		revEnum[a[1]] = e[a[0]];
	});
	return new t.Type<T[keyof T],string,unknown>(
		name,
		(u): u is T[keyof T] => true,
		(u, c) => {
			if(typeof u == 'string' && revEnum[u]){
				return t.success(revEnum[u]);
			}
			return t.failure(u, c);
		},
		a => ("")
	)
}

export enum FlagColor {
	RED="R",
	YELLOW = "Y",
	GREEN = "G",
    BLACK = "C"
}

const path = "/flag-color";

export const validator = t.type({
    flagColor: EnumType('flagColor', FlagColor),
});

export const getWrapper = new APIWrapper<typeof validator, {}, {}>({
    path: path,
    type: HttpMethod.GET,
    resultValidator: validator,
    serverIndex: 1
})

export const flagEnumValidator = EnumType("flagColor", FlagColor);

export const allFlags = Object.values(FlagColor);

export function getFlagColor(color: string): FlagColor{
    const found = allFlags.find((a) => a == color);
    return (found != undefined) ? found : FlagColor.BLACK;
}
