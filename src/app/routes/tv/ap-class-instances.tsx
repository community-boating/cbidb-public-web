import * as React from 'react';
import {apTVPath} from "app/paths/tv/ap-class-instances";
import PageWrapper from "core/PageWrapper";
import { APClassSchedule } from 'containers/tv/ApClassSchedule';
import RouteWrapper from 'core/RouteWrapper';
import {apiw} from "async/ap-class-instances"

export const apTVPageRoute = new RouteWrapper(true, apTVPath, history => <PageWrapper
	key="ApClassesTV"
	history={history}
	component={(urlProps: {}, async: any) => <APClassSchedule
		history={history}
        groupedByDate={(function() {
            const parseClassData = (data: any) => {
                return data.rows.map((row: any) => {
                    var rowObj: any = {};
                    row.forEach((value: any, i: any) => {
                        rowObj[data.metaData[i].name] = value;
                    });
                    return rowObj;
                });
            };
            
            const classDataGroupedByDate = (data: any) => {
                return data.reduce((days: any, row: any) => {
                    if (days.length == 0 || days[days.length-1].date != row["START_DATE"]) {
                        days.push({date: row["START_DATE"], classes: []});
                    }
                    days[days.length-1].classes.push(row);
                    return days;
                }, []);
            };

            console.log(classDataGroupedByDate(parseClassData(async.data)))

            return classDataGroupedByDate(parseClassData(async.data));
        }())}
	/>}
	urlProps={{}}
	shadowComponent={<div></div>}
	getAsyncProps={(urlProps: {}) => {
		return apiw("06/15/2019").send(null).catch((err: any) => Promise.resolve(null));  // TODO: handle failure
	}}
/>);



