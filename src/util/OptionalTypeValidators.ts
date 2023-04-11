import * as t from 'io-ts'
import { Option, some, none } from 'fp-ts/lib/Option';
import * as moment from "moment";

export const DefaultDateTimeFormat = "YYYY-MM-DDTHH:mm:ss";
export const DefaultDateFormat = "YYYY-MM-DD";

function isOption(u: unknown): u is Option<any> {
	return u && (u as any)['_tag'] != undefined;
}

const OptionType = new t.Type<Option<any>, string, unknown>(
	'Option',
	(u): u is Option<any> => isOption(u),
	(u, c) => {
		if(isOption(u)){
			return t.success(u);
		}else if(u === null || u === undefined){
			return t.success(<Option<any>>none);
		}else{
			return t.success(<Option<any>>some(u));
		}
	},
	a => a.fold("None", (s) => `some(${s})`)
)

function OptionalTypeWithExtraValidator<T>(name: string, type: t.Type<T, any, unknown>){
	return (new t.Type<Option<T>, string, unknown>(
		name,
		OptionType.is,
		(u, c) => OptionType.validate(u, c).chain((s) => {
			if(s.isNone())
				return t.success(s);
			return type.validate(s.getOrElse(undefined),c).chain((u => t.success(some(u))))
		}),
		OptionType.encode
	));
}


function DateWithFormat(name: string, format: string){
	return new t.Type<moment.Moment,string,unknown>(
		name,
		(u): u is moment.Moment => moment.isMoment(u),
		(u, c) => {
			const m = moment(u, format);
			return ((m.isValid()) ? t.success(m) : t.failure(u, c))
		},
		a => a.format(format)
	)
}

export const OptionalString = new t.Type<Option<string>, string, unknown>(
	'OptionalString',
	(u): u is Option<string> => u instanceof Option, // TODO: this is not the Option you think it is.  Replace with something like (undefined !== u["_tag"])
	(u, c) =>
		t.union([t.string, t.null, t.undefined]).validate(u, c).chain(s => {
			if (s === null || s === undefined) return t.success(<Option<string>>none)
			else return t.success(some(s))
		}),
	a => a.fold("None", (s) => `some(${s})`)
)

export const OptionalStringList = new t.Type<Option<string[]>, string, unknown>(
	'OptionalString',
	(u): u is Option<string[]> => u instanceof Option,
	(u, c) =>
		t.union([t.array(t.string), t.null, t.undefined]).validate(u, c).chain(s => {
			if (s === null || s === undefined) return t.success(<Option<string[]>>none)
			else return t.success(some(s))
		}),
	a => a.fold("None", (s) => `some(${s})`)
)

export const OptionalNumber = new t.Type<Option<number>, string, unknown>(
	'OptionalNumber',
	(u): u is Option<number> => u instanceof Option,
	(u, c) =>
		t.union([t.number, t.null, t.undefined]).validate(u, c).chain(s => {
			if (s === null || s === undefined) return t.success(<Option<number>>none)
			else return t.success(some(s))
		}),
		a => a.fold("None", (s) => `some(${s})`)
)

export const OptionalBoolean = new t.Type<Option<boolean>, string, unknown>(
	'OptionalBoolean',
	(u): u is Option<boolean> => u instanceof Option,
	(u, c) =>
		t.union([t.boolean, t.null, t.undefined]).validate(u, c).chain(s => {
			if (s === null || s === undefined) return t.success(<Option<boolean>>none)
			else return t.success(some(s))
		}),
		a => a.fold("None", (s) => `some(${s})`)
)

export const makeOptional = <T extends t.Any>(someValidator: T) => new t.Type<Option<t.TypeOf<T>>, string, unknown>(
	'Optional',
	(u): u is Option<t.TypeOf<T>> => isOption(u),
	(u, c) =>
		t.union([someValidator as t.Any, t.null, t.undefined]).validate(u, c).chain(s => {
			if (s === null || s === undefined) return t.success(<Option<t.TypeOf<T>>>none)
			else if(s["_tag"] !== undefined) return t.success(s)
			else return t.success(some(s))
		}),
		a => a.fold("None", (s) => `some(${s})`)
)

export const Date = DateWithFormat('Date', DefaultDateFormat);

export const DateTime = DateWithFormat('DateTime', DefaultDateTimeFormat);

export const OptionalDate = OptionalTypeWithExtraValidator("OptionalDate", Date);

export const OptionalDateTime = OptionalTypeWithExtraValidator("OptionalDateTime", DateTime);
