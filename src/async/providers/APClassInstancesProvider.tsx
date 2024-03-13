import * as t from 'io-ts';
import * as React from 'react';
import AsyncStateProvider from './AsyncStateProvider';
import {getWrapper as getAPClassInstances, validator} from '../embedded/class-tables/ap-class-instances';
import { option } from 'fp-ts';
import * as moment from 'moment';

const defaultAPClassInstances: t.TypeOf<typeof validator> = [];

const currentDate = moment().format('mm/dd/YYYY');

const fakeAPClassInstances: typeof defaultAPClassInstances = [
    {
        instanceId: 1,
        typeName: option.some('A Class'),
        startDate: currentDate,
        startTime: '09:45 PM',
        locationString: option.some('Some Place Over Here'),
        enrollees: 0

    },
    {
        instanceId: 2,
        typeName: option.some('Derp Class'),
        startDate: currentDate,
        startTime: '08:00 PM',
        locationString: option.some('Placey'),
        enrollees: 0

    },
    {
        instanceId: 3,
        typeName: option.some('Wind Class'),
        startDate: currentDate,
        startTime: '09:45 PM',
        locationString: option.some('Some Place Over Here'),
        enrollees: 0

    }
]

export const APClassInstancesContext = React.createContext(defaultAPClassInstances);

export default function APClassInstancesProvider(props: {children?: React.ReactNode}){
    return <AsyncStateProvider apiWrapper={getAPClassInstances} initState={defaultAPClassInstances} refreshRate={30*1000} makeChildren={(state) => {return <APClassInstancesContext.Provider value={state}>{props.children}</APClassInstancesContext.Provider>}}/>
}