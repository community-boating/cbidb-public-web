import * as React from 'react';
import * as t from 'io-ts';
import APIWrapper from 'core/APIWrapper';

export type AsyncStateProviderProps<T_Validator extends t.Any> = {
    apiWrapper: APIWrapper<T_Validator, any, any>
    spinnerOnInit?: boolean
    initState?: t.TypeOf<T_Validator>
    refreshRate?: number
    postGet?: (res: t.TypeOf<T_Validator>) => t.TypeOf<T_Validator>
    makeChildren: (state: t.TypeOf<T_Validator>, setState: React.Dispatch<React.SetStateAction<t.TypeOf<T_Validator>>>, providerState?: ProviderState) => React.ReactNode
}

export enum ProviderState{
    INITIAL, ERROR, SUCCESS
}

type AsyncStateProviderState<T_Validator extends t.Any> = {
    mainState: t.TypeOf<T_Validator>
    providerState: ProviderState
}

export default class AsyncStateProvider<T_Validator extends t.Any> extends React.Component<AsyncStateProviderProps<T_Validator>, AsyncStateProviderState<T_Validator>> {
    mounted
    intervalID: NodeJS.Timeout
    waitForLogin
    constructor(props: AsyncStateProviderProps<T_Validator> | Readonly<AsyncStateProviderProps<T_Validator>>){
        super(props);
        this.mounted = false;
        this.waitForLogin = false;
        this.state = {mainState:props.initState, providerState: ProviderState.INITIAL};
        this.setState = this.setState.bind(this);
        this.render = this.render.bind(this);
    }
    loadAsync(){
        this.props.apiWrapper.send().then((a) => {
            if(!this.mounted){
                return;
            }
            if(a.type == "Success"){
                const stateToUse = this.props.postGet? this.props.postGet(a.success): a.success
                this.setState({mainState: stateToUse, providerState: ProviderState.SUCCESS});
                this.waitForLogin = false;
            }else{
                //if(a.code == API_CODE_NOT_LOGGED_IN){
                //    this.waitForLogin = true;
                //}
                //else{
                    this.setState((s) => ({...s, providerState: ProviderState.ERROR}));
                //}
            }
        });
    }
    componentDidMount(): void {
        this.mounted = true;
        if(this.props.refreshRate) {
            this.intervalID = setInterval(() => {
                this.loadAsync();
            }, this.props.refreshRate);
        }
        this.loadAsync();
    }
    componentWillUnmount(): void {
        this.mounted = false;
        if(this.intervalID){
            clearInterval(this.intervalID);
            this.intervalID = undefined;
        }
    }
    render(): React.ReactNode {
        if(this.waitForLogin && this.context.state.login.authenticatedUserName){
            this.loadAsync();
            this.waitForLogin = false;
        }
        if(this.state.providerState == ProviderState.ERROR && this.props.spinnerOnInit){
            return <p className="text-red-900">Error Loading</p>
        }
        if(this.props.spinnerOnInit && this.state.providerState == ProviderState.INITIAL){
            return <p>derp</p>;
        }
        return <>{this.props.makeChildren(this.state.mainState, (s) => this.setState((b) => ({...b, mainState: setStateChain(s, b.mainState)})), this.state.providerState)}</>;
    }
}

const isCallback = (
    maybeFunction: any | ((...args: any[]) => void),
  ): maybeFunction is (...args: any[]) => void =>
    typeof maybeFunction === 'function'

function setStateChain<T_State>(state: React.SetStateAction<T_State>, oldState: T_State){
    if(isCallback(state)){
        return state(oldState);
    }
    return state;
}