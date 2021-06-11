import * as t from 'io-ts';

import { PostType, Config, ApiResult } from './APIWrapperTypes';

type MockConfig<T_ResponseValidator extends t.Any, T_FixedParams> = Config<T_ResponseValidator, T_FixedParams> & {
	mockResult: t.TypeOf<T_ResponseValidator>
}

// TODO: do we still need do() vs send() vs sendWithHeaders(), can probably tidy this all up into one function that does the thing
export default class APIMock<T_ResponseValidator extends t.Any, T_PostJSON, T_FixedParams> {
	config: MockConfig<T_ResponseValidator, T_FixedParams>
	constructor(config: MockConfig<T_ResponseValidator, T_FixedParams>) {
		this.config = config;
	}
	send: (data: PostType<T_PostJSON>) => Promise<ApiResult<t.TypeOf<T_ResponseValidator>>> =
		data => Promise.resolve({type: "Success", success: this.config.mockResult})

}
