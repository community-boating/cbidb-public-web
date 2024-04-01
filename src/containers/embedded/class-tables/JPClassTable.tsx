import { AsyncPropsType } from "app/routes/embedded/class-tables/jp-class-instances";
import * as React from "react";
import { ReactNode } from "react";
import * as moment from "moment";
import ClassSchedule, { ClassScheduleItem } from "./ClassSchedule";

function isAfternoon(moment: moment.Moment){
    return moment.get("hours") >= 12;
}

function flagIconURL(sectionName: string){
    const newName = (function() {
        switch (sectionName) {
        case "Juliett":
            return "Juliet";
        case "X-Ray":
            return "X-ray";
        default:
            return sectionName;
        }
    }());
    return "https://fileserv.community-boating.org/joomsource/signal-flags/ICS_" + newName + ".svg";
}

type ClassInstancesByTimeAndInstanceIDType = {[time: string] : {[instanceId: number] : AsyncPropsType}}
function mapClassItems(jpClassInstances: AsyncPropsType): ClassScheduleItem[] {
    console.log(jpClassInstances);
    return jpClassInstances.map((a) => ({
        startTime: moment(a.startTime, "hh:mmA"),
        id: a.instanceId,
        display: <div className="b-solid b-2 br-10 m-5">
                <table className="w-full no-spacing">
                    <tbody className="no-spacing">
                        <tr>
                            <td>
                                <h1 className="m-0" style={{color: mapColor(a.typeName)}}>{a.typeName}</h1>
                            </td>
                            <td width="40%">
                                <img src={flagIconURL(a.sectionName.getOrElse(""))} width={18} height={18}/>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <h2 className="">{a.locationName.getOrElse("")}</h2>
                            </td>
                            <td width="40%">
                                <p className="m-0">{a.instructorNameFirst.getOrElse("")} {a.instructorNameLast.getOrElse("")}</p>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
    }))
}

const mapColor = (className: string) => {
	switch (className) {
	case "Learn-to-Sail & Kayak":
	case "Mercury Green Review":
	case "Beginner Sailing":
		return "#a3ffa3";
	case "Mainsail":
    case "Mainsail I":
	case "Intermediate Sailing":
	case "Mercury Fast Track":
	case "Mercury Clinic":
		return "#ffffa3";
	case "Jib":
		return "#ffa3a3";
	case "Windsurfing":
		return "#a3a3ff";
	case "Laser":
	case "420":
		return "#ffd7a3";
	case "Kayak":
	case "Stand Up Paddleboard":
		return "#d1a3ff";
	case "Kayak Adventure":
		return "#d1a3ff";
	case "Race Team":
		return "#ffa3a3";
	case "Keelboat 1":
	case "Keelboat 2":
	case "Keelboat":
		return "#ffa3a3";
	case "Environmental Science":
	case "RoboSail":
		return "#a3ffff";
	default:
		return "#000000";
	}
};

export const JPClassTable = (props: {jpClassInstances: AsyncPropsType}) => {
    const classItems = mapClassItems(props.jpClassInstances);
    return <ClassSchedule classItems={classItems}/>;
}