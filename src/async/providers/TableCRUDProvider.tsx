import APIWrapper from "core/APIWrapper"
import { option } from "fp-ts";
import * as t from 'io-ts';

interface ITableCRUDProvider<T_TableRow, T_ID extends keyof T_TableRow> {
     getMultiple(ids: T_TableRow[T_ID][]): T_TableRow[]
     get(id: T_TableRow[T_ID]): T_TableRow
     putMultiple(values: (Partial<T_TableRow> & Pick<T_TableRow, T_ID>)[]): void
     put(value: Partial<T_TableRow> & Pick<T_TableRow, T_ID>): void
     deleteMultiple(ids: T_TableRow[T_ID][]): void
     delete(value: T_TableRow[T_ID]): void
}

const exampleValidator = t.type({
    id: t.number,
    value: t.string,
    size: t.string
})

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

const exampleValidatorOptional = makeOptionalProps(exampleValidator, 'id')

exampleValidatorOptional['props'].size

class ExpressTableCRUDFactory<T_TableRow extends t.Any, T_ID extends keyof T_TableRow> {
    createCRUDProvider(){
        const provider: EagerExpressTableCRUDProvider<T_TableRow, T_ID> = new EagerExpressTableCRUDProvider()
        provider.getWrapper.send(null).then((a) => {
            if(a.type == 'Success')
                a.success
        })
    }
}

class CacheTableCRUDProvider<T_TableRow, T_ID extends keyof T_TableRow> implements ITableCRUDProvider<T_TableRow, T_ID>{
    getMultiple(ids: T_TableRow[T_ID][]): T_TableRow[] {
        throw new Error("Method not implemented.")
    }
    get(id: T_TableRow[T_ID]): T_TableRow {
        throw new Error("Method not implemented.")
    }
    putMultiple(values: (Partial<T_TableRow> & Pick<T_TableRow, T_ID>)[]): void {
        throw new Error("Method not implemented.")
    }
    put(value: Partial<T_TableRow> & Pick<T_TableRow, T_ID>): void {
        throw new Error("Method not implemented.")
    }
    deleteMultiple(ids: T_TableRow[T_ID][]): void {
        throw new Error("Method not implemented.")
    }
    delete(value: T_TableRow[T_ID]): void {
        throw new Error("Method not implemented.")
    }

}

type OptionalWithKey<A extends {[key: string]: any}, PK extends keyof A> = {
	[PropertyKey in keyof Omit<A, PK>]: t.Type<option.Option<t.TypeOf<Omit<A, PK>[PropertyKey]>>>
} & Pick<A, PK>

class EagerExpressTableCRUDProvider<T_TableRow extends t.Any, T_ID extends keyof T_TableRow> implements ITableCRUDProvider<T_TableRow, T_ID>{
    tablePrimaryKey: T_ID
    getWrapper: APIWrapper<t.ArrayC<t.TypeOf<T_TableRow>>, any, any>
    putWrapper: APIWrapper<any, any, any>
    getMultiple(ids: T_TableRow[T_ID][]): T_TableRow[] {
        throw new Error("Method not implemented.")
    }
    get(id: T_TableRow[T_ID]): T_TableRow {
        throw new Error("Method not implemented.")
    }
    putMultiple(values: (Partial<T_TableRow> & Pick<T_TableRow, T_ID>)[]): T_TableRow[] {
        throw new Error("Method not implemented.")
    }
    put(value: Partial<T_TableRow> & Pick<T_TableRow, T_ID>): T_TableRow {
        throw new Error("Method not implemented.")
    }
    deleteMultiple(ids: T_TableRow[T_ID][]): void {
        throw new Error("Method not implemented.")
    }
    delete(value: T_TableRow[T_ID]): void {
        throw new Error("Method not implemented.")
    }

}

class LazyExpressTableCRUDProvider<T_TableRow, T_ID extends keyof T_TableRow> implements ITableCRUDProvider<T_TableRow, T_ID> {
    getMultiple(ids: T_TableRow[T_ID][]): T_TableRow[] {
        return
    }
    get(id: T_TableRow[T_ID]): T_TableRow {
        throw new Error("Method not implemented.")
    }
    putMultiple(values: (Partial<T_TableRow> & Pick<T_TableRow, T_ID>)[]): T_TableRow[] {
        throw new Error("Method not implemented.")
    }
    put(value: Partial<T_TableRow> & Pick<T_TableRow, T_ID>): T_TableRow {
        throw new Error("Method not implemented.")
    }
    deleteMultiple(ids: T_TableRow[T_ID][]): void {
        throw new Error("Method not implemented.")
    }
    delete(value: T_TableRow[T_ID]): void {
        throw new Error("Method not implemented.")
    }
    
}
