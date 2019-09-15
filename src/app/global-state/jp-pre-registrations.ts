import { Option } from "fp-ts/lib/Option"

export type PreRegistrationClass = {
	instanceId: number,
	dateRange: string,
	timeRange: string
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