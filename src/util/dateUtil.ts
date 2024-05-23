import * as moment from 'moment';

export const DATETIME_FORMAT = "YYYY-MM-DDTHH:mm:ss"
export const DATE_FORMAT = "YYYY-MM-DD"
export const TIME_FORMAT = "HH:mm:ss"

export const DATETIME_FORMAT_API = "MM/DD/yyyy  HH:mm:ss"
export const DATE_FORMAT_API = "MM/DD/yyyy"

export function toMomentFromLocalDateTime(input: string): moment.Moment {
	return moment(input, DATETIME_FORMAT)
}

export function toMomentFromLocalDate(input: string): moment.Moment {
	return moment(input, DATE_FORMAT)
}

export function sortOnMoment<T>(f: (e: T) => moment.Moment): ((a: T, b: T) => number) {
	return (a: T, b: T) => {
		const aMoment = f(a);
		const bMoment = f(b);
		return Number(aMoment.format('X')) - Number(bMoment.format('X'));
	}
}
