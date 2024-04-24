import { OptionalWithKey, makeOptionalProps } from "async/util/Optional";
import APIWrapper from "core/APIWrapper"
import { HttpMethod } from "core/HttpMethod";
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

class ExpressTableCRUDFactory<T_TableRow extends t.Any, T_ID extends keyof T_TableRow> {
    createCRUDProvider(){
        /*const provider: EagerExpressTableCRUDProvider<t.TypeOf<T_TableRow>, T_ID> = new EagerExpressTableCRUDProvider()
        provider.getWrapper.send(null).then((a) => {
            if(a.type == 'Success')
                a.success
        })*/
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



class EagerExpressTableCRUDProvider<T_RowValidator extends t.Any, T_ID extends keyof T_TableRow, T_TableRow extends t.TypeOf<T_RowValidator> = t.TypeOf<T_RowValidator>> implements ITableCRUDProvider<T_TableRow, T_ID>{
    tablePrimaryKey: T_ID
    //getWrapper: APIWrapper<T_RowValidator, OptionalWithKey<T_TableRow, T_ID>, any>
    putWrapper: APIWrapper<T_TableRow, any, any>
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

const exampleValidator = t.type({
    id: t.number,
    value: t.string,
    size: t.string
})

const exampleValidatorOptional = makeOptionalProps(exampleValidator, 'id')

const testGetter = new APIWrapper({
    path: '',
    type: HttpMethod.GET,
    resultValidator: exampleValidator
})

const postGetter = new APIWrapper({
    path: '',
    type: HttpMethod.POST,
    resultValidator: exampleValidator,
    postBodyValidator: makeOptionalProps(exampleValidator)
})

const testProver = new EagerExpressTableCRUDProvider<typeof exampleValidator, 'id'>()
//testProver.getWrapper = postGetter
//testProver.putWrapper = postGetter

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
