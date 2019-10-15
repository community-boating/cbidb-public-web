import { Option } from "fp-ts/lib/Option"
import { Moment } from 'moment'

export type PreRegistrationClass = {
	instanceId: number,
	dateRange: string,
	timeRange: string,
	expirationDateTime?: Moment,
	minutesRemaining?: number
}

export type PreRegistration = {
	firstName: string,
	beginner: Option<PreRegistrationClass>,
	intermediate: Option<PreRegistrationClass>
}

export type JpPreRegistrationState = {
	preregistrations: PreRegistration[]
}

export const defaultState = {
	preregistrations: []
}