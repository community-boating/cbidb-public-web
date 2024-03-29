import * as t from 'io-ts';
import * as React from 'react';
import AsyncStateProvider from './AsyncStateProvider';
import { getWrapper as getJPClassInstances, validator} from '../embedded/class-tables/jp-class-instances';
import { option } from 'fp-ts';

const defaultJPClassInstances: t.TypeOf<typeof validator> = [];

const fakeJPClassInstances: typeof defaultJPClassInstances = [
    {
        instanceId: 1,
        typeName: option.some('SAILING'),
        startDate: '',
        startTime: '',
        locationName: option.some('derp'),
        enrollees: 0
    }
]

export const JPClassInstancesContext = React.createContext(defaultJPClassInstances);

export default function JPClassInstancesProvider(props: {children?: React.ReactNode}){
    return <AsyncStateProvider apiWrapper={getJPClassInstances} initState={defaultJPClassInstances} refreshRate={30*1000} makeChildren={(state) => {return <JPClassInstancesContext.Provider value={fakeJPClassInstances}>{props.children}</JPClassInstancesContext.Provider>}}/>
}