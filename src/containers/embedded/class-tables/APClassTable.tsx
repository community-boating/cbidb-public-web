import { AsyncPropsType } from "app/routes/embedded/class-tables/ap-class-instances"
import * as React from "react"

function sortGroupByTime(apClassInstances: AsyncPropsType){
}

export const APClassTable = (props: {apClassInstances: AsyncPropsType}) => {
    const byTime = sortGroupByTime(props.apClassInstances);
    return <table className='w-full max-w-full table padding-8'>
        <tbody className='font-sm align-center'>
            {props.apClassInstances.map((a)=> {
                return <tr key={a.instanceId} className='b-2 b-solid b-gray br-10 block' >
                    <td className='font-md' width="20%"><p>{a.startTime}</p></td>
                    <td className='font-md' width="30%"><p>{a.typeName.getOrElse("")}</p></td>
                    <td width="50%"><p>{a.locationString.getOrElse("")}</p></td>
                </tr>
            })}
        </tbody>
    </table>
}