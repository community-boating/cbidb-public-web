import * as React from 'react';
import * as t from 'io-ts';
import {jpPathClassTime} from "../../paths/jp/classTime";
import PageWrapper from "../../../core/PageWrapper";
import RouteWrapper from "../../../core/RouteWrapper";
import { getWrapper as getSignups, GetSignupsAPIResult } from '../../../async/junior/get-signups';
import { getWrapper as classTimesWrapper, getClassInstancesValidator as classTimesValidator } from "../../../async/junior/get-class-instances";
import SelectClassTime from "../../../containers/jp/class-signup/SelectClassTime";
import {apiw as getWeeks, weeksValidator} from "../../../async/weeks";
import JoomlaLoadingPage from '../../../theme/joomla/JoomlaLoadingPage';
import { setJPImage } from '../../../util/set-bg-image';

export const classTimePageRoute = new RouteWrapper(true, jpPathClassTime, history => <PageWrapper
    key="SelectClassTime"
    history={history}
    component={(
        urlProps: {personId: number, typeId: number},
        [times, weeks, signups]: [t.TypeOf<typeof classTimesValidator>, t.TypeOf<typeof weeksValidator>, GetSignupsAPIResult]
    ) => <SelectClassTime
        typeId={urlProps.typeId}
        personId={urlProps.personId}
        apiResult={times}
        weeks={weeks}
        history={history}
        signups={signups}
    />}
    urlProps={{
        personId: Number(jpPathClassTime.extractURLParams(history.location.pathname).personId),
        typeId: Number(jpPathClassTime.extractURLParams(history.location.pathname).typeId)
    }}
    shadowComponent={<JoomlaLoadingPage setBGImage={setJPImage} />}
    getAsyncProps={(urlProps: {personId: number, typeId: number}) => {
        return Promise.all([
            classTimesWrapper(urlProps.typeId, urlProps.personId).send(null),
            getWeeks.send(null),
            getSignups(urlProps.personId).send(null)
        ]).catch(err => Promise.resolve(null));  // TODO: handle failure
    }}
/>);



