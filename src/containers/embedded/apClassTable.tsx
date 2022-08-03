import { AsyncPropsType } from "app/routes/embedded/ap-class-instances"
import * as React from "react"
import { borderStyle, headerFontSize, tableStyle, thFull, thWrap } from "./styleConstants"

const styleEnd: React.CSSProperties = {borderBottom: borderStyle, fontSize: headerFontSize, paddingTop: "15px", paddingBottom: "15px", paddingLeft: "10px", paddingRight: "10px", margin: "0"};
const styleFirst: React.CSSProperties = {...styleEnd, borderRight: borderStyle};
const styleMiddle: React.CSSProperties = {...styleFirst, paddingRight: "100px"};
const style: React.CSSProperties = {margin: "0"};

export const APClassTable = (props: {apClassInstances: AsyncPropsType}) => {
    return <table style={tableStyle}>
        <thead>
            <tr>
                <th style={thWrap}>TIME</th>
                <th style={thWrap}>CLASS</th>
                <th style={thFull}>LOCATION</th>
            </tr>
        </thead>
        <tbody>
            {props.apClassInstances.map((a)=> {
                return <tr key={a.instanceId} >
                    <td style={styleFirst}><p style={style}>{a.startTime}</p></td>
                    <td style={styleMiddle}><p style={style}>{a.typeName.getOrElse("")}</p></td>
                    <td style={styleEnd}><p style={style}>{a.locationString.getOrElse("")}</p></td>
                </tr>
            })}
        </tbody>
    </table>
}