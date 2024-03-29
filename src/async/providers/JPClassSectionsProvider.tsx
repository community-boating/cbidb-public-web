import * as t from 'io-ts';
import * as React from 'react';
import AsyncStateProvider from './AsyncStateProvider';
import {getJPClasses as getJPClassInstances, validator} from '../embedded/class-tables/jp-class-sections';
import { option } from 'fp-ts';

const defaultJPClassSections: t.TypeOf<typeof validator> = [];

const fakeJPClassSections: typeof defaultJPClassSections = [
    {
        sectionId: 1,
        sectionName: option.some('Romeo'),
        instanceId: 1,
        typeName: 'Mainsail I',
        startDate: '',
        startTime: '9:00PM',
        instructorNameFirst: option.some('first'),
        instructorNameLast: option.some('last'),
        locationName: option.some('location'),
        enrollees: 0
    },
    {
        sectionId: 1,
        sectionName: option.some('Romeo'),
        instanceId: 2,
        typeName: 'Mainsail I',
        startDate: '',
        startTime: '9:00PM',
        instructorNameFirst: option.some('first'),
        instructorNameLast: option.some('last'),
        locationName: option.some('location'),
        enrollees: 0
    },
    {
        sectionId: 2,
        sectionName: option.some('Julliet'),
        instanceId: 3,
        typeName: 'Mainsail I',
        startDate: '',
        startTime: '11:00PM',
        instructorNameFirst: option.some('first'),
        instructorNameLast: option.some('last'),
        locationName: option.some('location'),
        enrollees: 0
    },
    {
        sectionId: 1,
        sectionName: option.some('Romeo'),
        instanceId: 4,
        typeName: 'Kayak',
        startDate: '',
        startTime: '9:30PM',
        instructorNameFirst: option.some('first'),
        instructorNameLast: option.some('last'),
        locationName: option.some('location'),
        enrollees: 0
    }
]

export const JPClassSectionsContext = React.createContext(defaultJPClassSections);

export default function JPClassSectionsProvider(props: {children?: React.ReactNode}){
    return <AsyncStateProvider apiWrapper={getJPClassInstances()} initState={defaultJPClassSections} refreshRate={30*1000} makeChildren={(state) => {return <JPClassSectionsContext.Provider value={fakeJPClassSections}>{props.children}</JPClassSectionsContext.Provider>}}/>
}