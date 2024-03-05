import { AsyncPropsType } from "app/routes/embedded/class-tables/ap-class-instances"
import * as React from "react"

function sortGroupByTime(apClassInstances: AsyncPropsType){
}

export const APClassTable = (props: {apClassInstances: AsyncPropsType}) => {
    const byTime = sortGroupByTime(props.apClassInstances);
    return <table className='w-full max-w-full table'>
        <thead>
            <tr className='font-md'>
                <th>TIME</th>
                <th>CLASS</th>
                <th>LOCATION</th>
            </tr>
        </thead>
        <tbody className='font-sm align-center'>
            {props.apClassInstances.map((a)=> {
                return <tr key={a.instanceId} className='border-b-sm' >
                    <td className='font-md'><p>{a.startTime}</p></td>
                    <td className='font-md'><p>{a.typeName.getOrElse("")}</p></td>
                    <td><p>{a.locationString.getOrElse("")}</p></td>
                </tr>
            })}
        </tbody>
    </table>
}