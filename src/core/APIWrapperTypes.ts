import { HttpMethod } from "./HttpMethod";
import * as t from 'io-ts';

export interface Success<T> {
	type: "Success",
	success: T
}

export interface Failure {
	type: "Failure",
	code: string,
	message?: string,
	extra?: any
}

export type ApiResult<T_Success> = Success<T_Success> | Failure

export interface ConfigCommon<T_ResponseValidator extends t.Any> {
	type: string & HttpMethod,
	path: string,
	extraHeaders?: object,
	resultValidator: T_ResponseValidator,
	serverIndex?: number,
	jsconMap?: (T_ResponseValidator extends t.ArrayC<any> | t.TypeC<any> ? {[Property in keyof (T_ResponseValidator extends t.ArrayC<any> ? t.TypeOf<T_ResponseValidator>[number] : t.TypeOf<T_ResponseValidator>)]: string} : {[key: string]: string})/*(T_Value extends t.TypeC<any> ? {[Property in keyof T_Value]: string} : T_Value extends t.ArrayC<t.TypeC<any>>? {[Property in keyof t.TypeOf<T_Value>]: string} : {[key: string]: string})*/
}

export interface GetConfig<T_ResponseValidator extends t.Any> extends ConfigCommon<T_ResponseValidator> {
	type: HttpMethod.GET,
}

export interface PostConfig<T_ResponseValidator extends t.Any, T_FixedParams> extends ConfigCommon<T_ResponseValidator> {
	type: HttpMethod.POST,
	fixedParams?: T_FixedParams
}

export type Config<T_ResponseValidator extends t.Any, T_FixedParams> = GetConfig<T_ResponseValidator> | PostConfig<T_ResponseValidator, T_FixedParams>;

export interface ServerParams {
	host: string,
	https: boolean,
	port: number,
	pathPrefix?: string,
	staticHeaders?: object
}

export interface PostString {
	type: "urlEncoded",
	urlEncodedData: string
}

export interface PostJSON<T_PostJSON> {
	type: "json",
	jsonData: T_PostJSON
}

export type PostType<T> = PostString | PostJSON<T>