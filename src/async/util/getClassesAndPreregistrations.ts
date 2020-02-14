import {getWrapper as getClassesWithAvail} from "../class-instances-with-avail"
import moment = require('moment');
import { Success } from '../../core/APIWrapper';
import {getWrapper as getProtoPersonCookie} from "../check-proto-person-cookie"
import { getWrapper as getReservations } from '../junior/get-junior-class-reservations'


const getClassesAndPreregistrations = () => {
	return getProtoPersonCookie.send(null)
	.then(() => getReservations.send(null))
	.then(res => {
		if (res.type == "Success") {
			return Promise.resolve({
				type: "Success",
				success: res.success
			} as Success<typeof res.success>)
		} else return Promise.reject()
	})
	.then(prereg => {
		return getClassesWithAvail.send(null).then(classes => {
			return Promise.resolve({ classes, prereg })
		}, err => Promise.reject(err))
	})
	.then(({classes, prereg}) => {
		if (classes.type == "Success" && prereg.type == "Success") {
			return Promise.resolve({type: "Success", success: {
				prereg: prereg.success,
				classes: classes.success.map(row => {
					const startDateMoment = moment(row.startDatetimeRaw, "MM/DD/YYYY HH:mm")
					return {
						...row,
						startDateMoment,
						endDateMoment: moment(row.endDatetimeRaw, "MM/DD/YYYY HH:mm"),
						isMorning: Number(startDateMoment.format("HH")) < 12
					};
				})
			}})
		} else return Promise.reject();
		
	})
	.catch(err => Promise.resolve(null));  // TODO: handle failure
}

export default getClassesAndPreregistrations