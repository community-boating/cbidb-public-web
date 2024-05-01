import { Option, some, none } from "fp-ts/lib/Option";

export type OptionifiedProp<T> = T extends Option<any> ? T : Option<T>;

export declare type OptionifiedProps<T extends object> = {
	[Property in keyof T]: OptionifiedProp<T[Property]>;
}

export default function<T>(x: T): Option<T> {
	if (x === null || x === undefined) return none;
	else return some(x);
}