import { AsyncPropsType } from "app/routes/embedded/class-tables/ap-class-instances"
import * as moment from "moment"
import * as React from "react"
import ClassSchedule, { ClassScheduleItem } from "./ClassSchedule"

export const APClassTable = (props: {apClassInstances: AsyncPropsType}) => {
    const mapped = mapClassItems(props.apClassInstances)
    return <ClassSchedule classItems={mapped}/>
}

export function mapClassItems(apClassInstances: AsyncPropsType): ClassScheduleItem[] {
    return apClassInstances.map((a) => ({
        startTime: moment(a.startTime, "hh:mmA"),
        id: a.instanceId,
        display: <div className="b-solid b-2 br-10 m-5">
                <table className="w-full no-spacing">
                    <tbody className="no-spacing">
                        <tr>
                            <td>
                                <h1 className="m-0">{a.typeName.getOrElse("")}</h1>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <h2 className="">{a.locationString.getOrElse("")}</h2>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
    }))
}