import { PostString, PostJSON, GetType } from './APIWrapperTypes';

export const PostURLEncoded: (o: any) => PostString = o => {
	var arr = [];
	for (var p in o) {
		arr.push(encodeURIComponent(p) + "=" + encodeURIComponent(o[p]));
	}
	return makePostString(arr.join('&'))
}

export const makeGetString: (data: any) => GetType = (data) => ({
	type: "urlProps",
	urlProps: data
})

export const makePostString: (urlEncodedData: string) => PostString = urlEncodedData => ({type: "urlEncoded", urlEncodedData})
export const makePostJSON: <T_PostJSON>(jsonData: T_PostJSON) => PostJSON<T_PostJSON> = jsonData => ({type: "json", jsonData})
