import * as React from "react";
import Page from "../../components/Page";

interface Props {
	navBar?: JSX.Element
}

export default class JoomlaMainPage extends Page<Props> {
    render() {
        return (
            <div className="rt-container">
                <div className="rt-grid-12">
                    <div id="rt-main-column" className="page-content-light">
                        <div className="rt-block component-block" style={{minHeight: "350px"}}>
                            <div style={{position: "absolute", right: "20px", zIndex: 1000}}>{this.props.navBar}</div>
                            <div id="rt-mainbody">
                                <div className="component-content rt-joomla">
                                    <div className="rt-joomla">
                                        {this.props.children}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}