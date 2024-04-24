import { option } from "fp-ts";
import * as t from 'io-ts';

export type OptionalWithKey<A extends {[key: string]: any}, PK extends keyof A> = {
	[PropertyKey in keyof Omit<A, PK>]: t.Type<option.Option<t.TypeOf<Omit<A, PK>[PropertyKey]>>>
} & Pick<A, PK>

function isOption(u: any): u is option.Option<any> {
	return u && u['_tag'] != undefined;
}

export const makeOptional = <T extends t.Any>(someValidator: T) => new t.Type<option.Option<t.TypeOf<T>>, string, any>(
	'Optional',
	(u): u is option.Option<t.TypeOf<T>> => isOption(u),
	(u, c) =>
		t.union([someValidator as t.Any, t.null, t.undefined]).validate(u, c).chain(s => {
			if (s === null || s === undefined) return t.success((option.none))
			else if(s["_tag"] !== undefined) return t.success(s)
			else return t.success(option.some(s))
		}),
		a => a.fold("None", (s) => `some(${s})`)
)

export const makeOptionalProps = <A extends {[key: string]: any}, PKT extends keyof A>(someValidator: t.TypeC<A>, PK?: PKT) => {
	const newProps: OptionalWithKey<A, PKT> = {} as any;
	Object.keys(someValidator.props).forEach((a) => {
		if(a != PK)
			(newProps as any)[a] = makeOptional(someValidator.props[a]);
	})
	return t.type(newProps);
}