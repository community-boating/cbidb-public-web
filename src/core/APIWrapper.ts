import { Either } from 'fp-ts/lib/Either';
import { none, Option, some } from 'fp-ts/lib/Option';
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import * as t from 'io-ts';
import { PathReporter } from 'io-ts/lib/PathReporter';

import asc from "app/AppStateContainer";
import { removeOptions } from 'util/deserializeOption';
import { HttpMethod } from "./HttpMethod";
import { PostType, Config, ApiResult, ServerParams } from './APIWrapperTypes';

interface PostValues {content: string, headers: {}}

const searchJSCONMetaData: (metaData: any[]) => (toFind: string) => number = metaData => toFind => {
	for (var i=0; i<metaData.length; i++) {
		const name = metaData[i]["name"];
		if (name == toFind) return i;
	}
	return null;
}

var apiAxios: AxiosInstance = null;

function getOrCreateAxios(serverParams: ServerParams) {
	if (apiAxios == null) {
		console.log('instantiating axios');
		const portString = (function() {
			if (
				(serverParams.https && serverParams.port != 443) || 
				(!serverParams.https && serverParams.port != 80)
			) return `:${serverParams.port}`
			else return "";
		}());

		apiAxios = axios.create({
			baseURL: `${serverParams.https ? "https://" : "http://"}${serverParams.host}${portString}`,
			maxRedirects: 0,
			responseType: "json",
			// xsrfCookieName: "XSRF-TOKEN",
			// xsrfHeaderName: "X-XSRF-TOKEN",
		})
	}
	return apiAxios;
}


// TODO: do we still need do() vs send() vs sendWithHeaders(), can probably tidy this all up into one function that does the thing
export default class APIWrapper<T_ResponseValidator extends t.Any, T_PostJSON, T_FixedParams> {
	config: Config<T_ResponseValidator, T_FixedParams>
	constructor(config: Config<T_ResponseValidator, T_FixedParams>) {
		this.config = config;
	}
	send: (data: PostType<T_PostJSON>) => Promise<ApiResult<t.TypeOf<T_ResponseValidator>>> = data => this.sendWithParams(none)(data)
	sendWithParams: (serverParamsOption: Option<ServerParams>) => (data: PostType<T_PostJSON>) => Promise<ApiResult<t.TypeOf<T_ResponseValidator>>> = (serverParamsOption) => data => {
		const serverParams = serverParamsOption.getOrElse((process.env as any).serverToUseForAPI);
		const self = this;
		type Return = Promise<ApiResult<t.TypeOf<T_ResponseValidator>>>;
		var params: any = undefined;
		const postValues: Option<PostValues> = (function() {
			if (self.config.type === HttpMethod.POST) {
				if (data.type == "urlEncoded") {
					const postData = data.urlEncodedData
					return some({
						content: postData,
						headers: {
							// "Content-Type": "application/x-www-form-urlencoded",
							// "Content-Length": String(postData.length)
						}
					})
				} else if(data.type == "json") {
					const postData = removeOptions({
						...data.jsonData,
						...(self.config.fixedParams || {})
					})
					if (postData == undefined) return none;
					else return some({
						content: postData,
						headers: {
							// "Content-Type": "application/json",
							// "Content-Length": String(postData.length)
						}
					})
				}
			 } else {
				if(data && data.type == "urlProps"){
					params = data.urlProps;
				}
				return none;
			 }
		}())
		const headers = {
			...serverParams.staticHeaders,
			...(self.config.extraHeaders || {}),
			...postValues.map(pv => pv.headers).getOrElse(null)
		}
		return getOrCreateAxios(serverParams)({
			method: self.config.type,
			url: (serverParams.pathPrefix || "") + self.config.path,
			params,
			//params,
			//data: postValues.map(pv => pv.content).getOrElse(null),
			headers
		} as AxiosRequestConfig<any>).then((res: AxiosResponse) => {
			return this.parseResponse(res.data);
		}, err => {
			console.log("Error: ", err)
			const ret: Return = Promise.resolve({type: "Failure", code: "fail_during_send", message: "An internal error has occurred.", extra: {err}});
			console.log(ret);
			return ret;
		})
		.catch(err => {
			const ret: Return = Promise.resolve({type: "Failure", code: "fail_during_parse", message: "An internal error has occurred.", extra: {err}});
			console.log(ret)
			return ret;
		})
	}
	private parseResponse: (response: any) => ApiResult<t.TypeOf<T_ResponseValidator>> = response => {
		type Result = t.TypeOf<T_ResponseValidator>;
		type Return = ApiResult<t.TypeOf<T_ResponseValidator>>;

		const self = this;

		let parsed;
		try {
			parsed = response // JSON.parse(response)
		} catch (e) {
			const catchRet: Return = {type: "Failure", code: "client_not_json", message: "An internal error has occurred.", extra: {rawResponse: response}};
			console.log(catchRet)
			return catchRet;
		}
		
		if (parsed["error"]) {
			// Did the session time out? 
			if (parsed.error.code == "unauthorized" || parsed.error.code == "access_denied") {
				// TODO: call the is-logged-in endpoint and verify we are indeed not logged in
				// TODO: differentiate between unauthorized from cbi api vs some other random host (is that a supported use case?)
				asc.updateState.login.logout();
			}
			const ret2: Return = {type: "Failure", code: parsed.error.code, message: parsed.error.message, extra: parsed.error}
			console.log(ret2)
			return ret2
		}

		// If this is a JSCON endoint, loop through the data array and map each obj array to an actual object,
		// using the JSCON metadata and the defined mapping from our prop name to metadata column name
		const candidate = (function() {
			if (!self.config.jsconMap) return parsed;
			else {
				try {
					const rows = parsed["data"]["rows"];
					const metaData = parsed["data"]["metaData"];

					const mapFunction = searchJSCONMetaData(metaData)

					// mapping from prop name we care about to position in the JSCON array
					const columnMap = (function() {
						let map: any = {};
						for (var prop in self.config.jsconMap) {
							const jsconColumnName = self.config.jsconMap[prop]
							map[prop] = mapFunction(jsconColumnName)
						}
						return map;
					}());

					let retArray: any = [];
					rows.forEach((row: any) => {
						let rowObject: any = {};
						for (var prop in self.config.jsconMap) {
							rowObject[prop] = row[columnMap[prop]];
						}
						retArray.push(rowObject)
					})
					return retArray;
				} catch (e) {
					return parsed;
				}
			}
		}());

		const decoded: Either<t.Errors, Result> = this.config.resultValidator.decode(candidate)
		return (function() {
			let ret: Return
			if (decoded.isRight()) {
				ret = {type: "Success", success: decoded.getOrElse(null)};
			} else {
				ret = {type: "Failure", code: "parse_failure", message: "An internal error has occurred.", extra: {parseError: PathReporter.report(decoded).join(", ")}};
				console.log(ret)
			} 
			return ret;
		}());
	}
}
