import * as React from 'react';
import AsyncStateProvider from './AsyncStateProvider';
import {FlagColor, getWrapper as getFlagColor} from '../util/flag-color';

const defaultFlagColor = {flagColor: FlagColor.BLACK};

export const FlagColorContext = React.createContext(defaultFlagColor);

export default function FlagColorProvider(props: {children?: React.ReactNode}){
    return <AsyncStateProvider apiWrapper={getFlagColor} initState={defaultFlagColor} refreshRate={30*1000} makeChildren={(state) => {return <FlagColorContext.Provider value={state}>{props.children}</FlagColorContext.Provider>}}/>
}