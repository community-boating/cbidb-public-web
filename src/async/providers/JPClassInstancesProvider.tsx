import * as t from 'io-ts';
import * as React from 'react';
import AsyncStateProvider from './AsyncStateProvider';
import {getJPClasses as getJPClassInstances, validator} from '../embedded/class-tables/jp-class-instances';
import { option } from 'fp-ts';

const defaultJPClassInstances: t.TypeOf<typeof validator> = [];

const fakeJPClassInstances: typeof defaultJPClassInstances = [
    {
        sectionId: 1,
        sectionName: option.some('r'),
        instanceId: 1,
        typeName: 'R',
        startDate: '',
        startTime: '',
        instructorNameFirst: option.some('derp'),
        instructorNameLast: option.some('derp'),
        locationName: option.some('derp'),
        enrollees: 0
    }
]

export const JPClassInstancesContext = React.createContext(defaultJPClassInstances);

export default function JPClassInstancesProvider(props: {children?: React.ReactNode}){
    return <AsyncStateProvider apiWrapper={getJPClassInstances()} initState={defaultJPClassInstances} refreshRate={30*1000} makeChildren={(state) => {return <JPClassInstancesContext.Provider value={fakeJPClassInstances}>{props.children}</JPClassInstancesContext.Provider>}}/>
}