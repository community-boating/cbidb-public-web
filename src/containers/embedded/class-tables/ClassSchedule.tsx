import * as React from "react";
import * as moment from "moment";

export type ClassScheduleItem = {
    startTime: moment.Moment;
    id: number,
    display: React.ReactNode
}

export type ClassScheduleProps = {
    classItems: ClassScheduleItem[];
}

export type TimeBlockType = {
    classItems: ClassScheduleItem[]
    startTime: moment.Moment
    blockDuration: number
}

type ClassScheduleItemMap = {[key: number] : TimeBlockType}

function makeTimeBlocks(props: ClassScheduleProps): ClassScheduleItemMap {
    const mapped: ClassScheduleItemMap = {}
    props.classItems.sort((a, b) => (a.startTime.diff(b.startTime))).forEach((a, i) => {
        const key = a.startTime.unix();
        mapped[key] = mapped[key] || {classItems: [], startTime: a.startTime, blockDuration: 0};
        mapped[key].classItems.push(a);
    })
    const values = Object.values(mapped);
    return values.map((a, i) => {
        const blockDuration = (i + 1 < values.length) ? values[i + 1].startTime.diff(a.startTime, 'minutes') : 0
        return {...a, blockDuration: blockDuration}
    })
}

function TimeStyled(props: {time: moment.Moment}){
    return <span className='w-100'>
        <h2 className='inline'>{props.time.format("h")}</h2>
        <p className='inline align-super'>{props.time.format(":mmA")}</p>
    </span>
}

export default function ClassSchedule(props: ClassScheduleProps){
    const items = makeTimeBlocks(props);
    return <div className='w-full h-full'>
        {Object.entries(items).map((a, i) => <React.Fragment key={i}>
            <hr/>
            <div className="flex row" style={{paddingBottom: (a[1].blockDuration * 1) + "px"}}>
                <TimeStyled time={a[1].startTime}/>
                <div className="grow-1">
                    {a[1].classItems.map((b) => <div className="" key={b.id}>{b.display}</div>)}
                </div>
            </div>
        </React.Fragment>)}
    </div>
}