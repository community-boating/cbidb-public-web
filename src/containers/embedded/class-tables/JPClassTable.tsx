import { AsyncPropsType } from "app/routes/embedded/class-tables/jp-class-instances";
import * as React from "react";
import { ReactNode } from "react";
import * as moment from "moment";
import { option } from "fp-ts";

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
function mapClassInstances(jpClassInstances: AsyncPropsType): ClassInstancesByTimeAndInstanceIDType{
    const classInstancesMap: ClassInstancesByTimeAndInstanceIDType = {};
    const afternoonCurrently = isAfternoon(moment());
    jpClassInstances.forEach((a) => {
        classInstancesMap[a.startTime] = classInstancesMap[a.startTime] || {};
        classInstancesMap[a.startTime][a.instanceId] = classInstancesMap[a.startTime][a.instanceId] || [];
        classInstancesMap[a.startTime][a.instanceId].push(a);
    })
    return classInstancesMap;
}

const mapColor = (className: string) => {
	switch (className) {
	case "Learn-to-Sail & Kayak":
	case "Mercury Green Review":
	case "Beginner Sailing":
		return "#a3ffa3";
	case "Mainsail":
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
		return "#FFFFFF";
	}
};

const JPClassSubTable = (props: {jpClassInstances: AsyncPropsType}) => {
    return <>
    <b>{props.jpClassInstances[0].typeName}</b><br/>
        <table>
            <tbody>
                    {props.jpClassInstances.map((a) => {
                        return <tr key={a.sectionId}>
                            <td>{a.sectionName.fold<ReactNode>("", (b) => <span><img src={flagIconURL(b)} width={18} height={18}/><p>{b}:</p></span>)}<span><p>{a.instructorNameFirst.getOrElse("")} @ {a.locationName.getOrElse("")}</p></span></td>
                        </tr>;
                    })}
            </tbody>
        </table>
    </>;
}

export const JPClassTable = (props: {jpClassInstances: AsyncPropsType}) => {
    const classInstancesMap = mapClassInstances(props.jpClassInstances);
    const groupedInstances: ReactNode[] = Object.entries(classInstancesMap).map((a) => {
        return Object.entries(a[1]).map((b, index: number) => {
            return <tr key={a + ":" + b}>
                <td ><p>{index === 0 ? b[1][0].startTime : ""}</p></td>
                <td style={{backgroundColor: mapColor(b[1][0].typeName)}}><JPClassSubTable jpClassInstances={b[1]}/></td>
            </tr>;
        })
    })
    return <table>
        <thead>
            <tr>
                <th><b>TIME</b></th>
                <th><b>CLASS</b></th>
            </tr>
        </thead>
        <tbody>
            {groupedInstances}
        </tbody>
    </table>;
}