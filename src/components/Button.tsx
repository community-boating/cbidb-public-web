import * as React from "react";

interface Props {
    text: string,
    onClick: any
}

export default (props: Props) => 
    <a className="readon" style={{margin: "0 5px"}} onClick={props.onClick}>
        <span>{props.text}</span>
    </a>
