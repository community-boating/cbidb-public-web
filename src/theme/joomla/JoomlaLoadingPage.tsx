import * as React from "react";
import Page from "../../components/Page";

interface Props {
    showSpinner?: boolean
}

export default class JoomlaLoadingPage extends Page<Props> {
    render() {
        if (this.props.showSpinner) {
            return (
                <div className="rt-container">
                    <div className="rt-grid-12">
                        <div id="rt-main-column" className="page-content-light">
                            <div className="rt-block component-block" style={{minHeight: "350px"}}>
                                <div id="rt-mainbody">
                                    <div className="component-content rt-joomla">
                                        <div className="rt-joomla" style={{textAlign: "center"}}>
                                            <img src="/images/spinner-grey.gif" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            );
        } else {
            return (
                <div className="rt-container">
                    <div className="rt-grid-12">
                    </div>
                </div>
            );
        }
    }
}
