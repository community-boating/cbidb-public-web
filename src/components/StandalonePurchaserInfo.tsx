import * as React from "react"
import FactaArticleRegion from "theme/facta/FactaArticleRegion"
import TextInput from "./TextInput"
import {History} from 'history';
import newPopWin from "util/newPopWin";
import standaloneLoginPath from "app/paths/common/standalone-signin"
import {apiw as detach} from "async/proto-detach-member"
import {apiw as prove} from "async/prove-member"
import { PostURLEncoded } from "core/APIWrapperUtil";
import { Option } from 'fp-ts/lib/Option';
import asc from "app/AppStateContainer";

export type StandalonePurchaserProps = {
    authedAsRealPerson: boolean
    updateState: (id: string, value: string) => void
    state: {
        formData: {
            purchaserNameFirst: Option<string>,
            purchaserNameLast: Option<string>,
            email: Option<string>
        }
    }
    history: History
    hasPersonWarning: boolean
}

class FormInput<T_Form> extends TextInput<T_Form> {}

export default function StandalonePurchaserInfo(props: StandalonePurchaserProps){
    var handle = null
    const newPopWinInt = () => {
        newPopWin(standaloneLoginPath.getPathFromArgs({}) + props.state.formData.email.map(a => "#" + encodeURI(a)).getOrElse(""), 1100, 800)
    }
    if(props.hasPersonWarning){
        handle =
        <span style={{color: "#555", fontSize: "0.9em", fontStyle: "italic"}}>
        This email already has an account, <a href="#" onClick={() => {
                if(props.state.formData.email.isSome() && asc.state.login.authenticatedUserName.isSome() && props.state.formData.email.value == asc.state.login.authenticatedUserName.value){
                    prove.send(PostURLEncoded("")).then(() => {
                        props.history.push("/redirect" + window.location.pathname)
                    })
                }else{
                    newPopWinInt()
                }
            }}>
            click here to sign in</a>!
            <a href=""/>
        </span>
    }else if(props.authedAsRealPerson){
        handle = 
        <span style={{color: "#555", fontSize: "0.9em", fontStyle: "italic"}}>
            Thank you for signing in! <a href="#" onClick={() => detach.send(PostURLEncoded("")).then(() => {
                props.history.push("/redirect" + window.location.pathname)
            })}>Click here if you would like to use a different email</a>.
        </span>
    }else if(asc.state.login.authenticatedUserName.isSome()){
        handle =
        <span style={{color: "#555", fontSize: "0.9em", fontStyle: "italic"}}>
            You are already signed in! <a href="#" onClick={() => {prove.send(PostURLEncoded("")).then((a) => {
                props.history.push("/redirect" + window.location.pathname)
            })}}>
                click here to use your stored email and name</a>!
        </span>
    }else{
        handle = 
        <span style={{color: "#555", fontSize: "0.9em", fontStyle: "italic"}}>
        If you have an online account already, <a href="#" onClick={() => newPopWinInt()}>
            click here to sign in</a>!
        </span>
    }
    return <FactaArticleRegion title="My Information">
                                {handle}
                                <table><tbody>
                                    <FormInput
                                        id="purchaserNameFirst"
                                        label="Your First Name"
                                        value={props.state.formData.purchaserNameFirst}
                                        updateAction={props.updateState}
                                        size={30}
                                        maxLength={255}
                                        isRequired
                                        disabled={props.authedAsRealPerson}
                                    />
                                    <FormInput
                                        id="purchaserNameLast"
                                        label="Your Last Name"
                                        value={props.state.formData.purchaserNameLast}
                                        updateAction={props.updateState}
                                        size={30}
                                        maxLength={255}
                                        isRequired
                                        disabled={props.authedAsRealPerson}
                                    />
                                    <FormInput
                                        id="email"
                                        label="Your Email"
                                        value={props.state.formData.email}
                                        updateAction={props.updateState}
                                        size={30}
                                        maxLength={255}
                                        isRequired
                                        disabled={props.authedAsRealPerson}
                                    />
                                </tbody></table>
                            </FactaArticleRegion>
}