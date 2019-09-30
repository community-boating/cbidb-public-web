import * as React from "react";

interface Props {
    text: React.ReactNode,
    onClick: any,
    spinnerOnClick?: boolean
}

interface State {
    showSpinner: boolean
}

export default class Button extends React.PureComponent<Props, State> {
    constructor(props: Props) {
        super(props)
        this.state = {
            showSpinner: false
        }
    }
    startSpinner() {
        this.setState({
            ...this.state,
            showSpinner: true
        })
    }
    render() {
        const self = this;
        return (<a className="readon" style={{margin: "0 5px"}} onClick={e => {
            if (self.props.spinnerOnClick) self.startSpinner();
            self.props.onClick(e);
        }}>
        <span>{this.props.text}{this.state.showSpinner ? <span>&nbsp;&nbsp;<img height="14px" src="/images/spinner-white.gif" /></span>: ""}</span>
    </a>);
    }
}
