import { Either } from 'fp-ts/lib/Either';
import { none, Option, some } from 'fp-ts/lib/Option';
import * as http from 'http';
import * as https from "https";
import * as t from 'io-ts';
import { PathReporter } from 'io-ts/lib/PathReporter';

import asc from "../app/AppStateContainer";
import { removeOptions } from '../util/deserializeOption';
import { HttpMethod } from "./HttpMethod";

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

interface ConfigCommon<T_ResponseValidator extends t.Any> {
	type: string & HttpMethod,
	path: string,
	extraHeaders?: object, 
	resultValidator: T_ResponseValidator
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

interface PostValues {content: string, headers: {"Content-Type": string, "Content-Length": string}}

export interface PostString {
	type: "urlEncoded",
	urlEncodedData: string
}

export interface PostJSON<T_PostJSON> {
	type: "json",
	jsonData: T_PostJSON
}
export const PostString: (urlEncodedData: string) => PostString = urlEncodedData => ({type: "urlEncoded", urlEncodedData})
export const PostJSON: <T_PostJSON>(jsonData: T_PostJSON) => PostJSON<T_PostJSON> = jsonData => ({type: "json", jsonData})


export type PostType<T> = PostString | PostJSON<T>

// TODO: do we still need do() vs send() vs sendWithHeaders(), can probably tidy this all up into one function that does the thing
export default class APIWrapper<T_ResponseValidator extends t.Any, T_PostJSON, T_FixedParams> {
	config: Config<T_ResponseValidator, T_FixedParams>
	constructor(config: Config<T_ResponseValidator, T_FixedParams>) {
		this.config = config;
	}
	send: (data: PostType<T_PostJSON>) => Promise<ApiResult<t.TypeOf<T_ResponseValidator>>> = data => this.sendWithParams(none)(data)
	sendWithParams: (serverParamsOption: Option<ServerParams>) => (data: PostType<T_PostJSON>) => Promise<ApiResult<t.TypeOf<T_ResponseValidator>>> = serverParamsOption => data => {
		const serverParams = serverParamsOption.getOrElse(asc.state.appProps.serverToUseForAPI);
		const self = this;
		type Return = Promise<ApiResult<t.TypeOf<T_ResponseValidator>>>;
		return new Promise((resolve, reject) => {
			const postValues: Option<PostValues> = (function() {
				if (self.config.type === HttpMethod.POST) {
					if (data.type == "urlEncoded") {
						const postData = data.urlEncodedData
						return some({
							content: postData,
							headers: {
								"Content-Type": "application/x-www-form-urlencoded",
								"Content-Length": String(postData.length)
							}
						})
					} else {
						const postData = JSON.stringify(removeOptions({
							...data.jsonData,
							...(self.config.fixedParams || {})
						}))
						console.log(postData)
						if (postData == undefined) return none;
						else return some({
							content: postData,
							headers: {
								"Content-Type": "application/json",
								"Content-Length": String(postData.length)
							}
						})
					}
				 } else return none;
			}())
	
			const options = {
				hostname: serverParams.host,
				port: serverParams.port,
				path: (serverParams.pathPrefix || "") + self.config.path,
				method: self.config.type,
				headers: <any>{
					...serverParams.staticHeaders,
					...(self.config.extraHeaders || {}),
					...postValues.map(v => v.headers).getOrElse(<any>{})
				}
			};
			console.log("making request to " + options.hostname + ":" + options.port + options.path)
			console.log(options)
			console.log("serverParams: ", serverParams)
	
			// TODO: should we embed the special case for logout directive on any response?  Seems heavy handed
			const reqCallback = (res: any) => {
				let resData = '';
				res.on('data', (chunk: any) => {
					resData += chunk;
				});
				res.on('end', () => {
					resolve(resData);
				});
			}
	
			// FIXME: figure out all this API vs SELF shit and why this function wont carry through
			//const req = serverParams.makeRequest(options, reqCallback);
			const req = (
				serverParams.https
				? https.request(options, reqCallback)
				: http.request(options, reqCallback)
			);
	
			req.on('error', (e: string) => {
				reject(e);
			});

			postValues.map(v => req.write(v.content))
	
			req.end();
		})
		.then((result: string) => {
			console.log("Got result from api: ", result.substr(0,50));
			const ret: Return = Promise.resolve(this.parseResponse(result));
			return ret;
		}, err => {
			console.log("Error: ", err)
			const ret: Return = Promise.resolve({type: "Failure", code: "fail_during_send", message: "An internal error has occurred.", extra: {err}})
			return ret;
		})
		.catch(err => {
			const ret: Return = Promise.resolve({type: "Failure", code: "fail_during_parse", message: "An internal error has occurred.", extra: {err}});
			return ret;
		})
	}
	private parseResponse: (response: string) => ApiResult<t.TypeOf<T_ResponseValidator>> = response => {
		type Result = t.TypeOf<T_ResponseValidator>;
		type Return = ApiResult<t.TypeOf<T_ResponseValidator>>;

		let parsed;
		try {
			parsed = JSON.parse(response)
		} catch (e) {
			const catchRet: Return = {type: "Failure", code: "client_not_json", message: "An internal error has occurred.", extra: {rawResponse: response}};
			return catchRet;
		}
		
		if (parsed["error"]) {
			// Did the session time out? 
			if (parsed.error.code == "unauthorized") {
				// TODO: call the is-logged-in endpoint and verify we are indeed not logged in
				// TODO: differentiate between unauthorized from cbi api vs some other random host (is that a supported use case?)
				asc.updateState.login.logout();
			}
			const ret2: Return = {type: "Failure", code: parsed.error.code, message: parsed.error.message, extra: parsed.error}
			return ret2
		}

		const decoded: Either<t.Errors, Result> = this.config.resultValidator.decode(parsed)
		return (function() {
			let ret: Return
			if (decoded.isRight()) {
				ret = {type: "Success", success: decoded.getOrElse(null)};
			} else {
				ret = {type: "Failure", code: "parse_failure", message: "An internal error has occurred.", extra: {parseError: PathReporter.report(decoded).join(", ")}};
			} 
			return ret;
		}());
	}
}