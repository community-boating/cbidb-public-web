import * as React from "react";
import Page from "../../components/Page";

interface JoomlaTwoColumnsProps {
    left: React.ReactNode,
    right: React.ReactNode
}

export default class JoomlaTwoColumns extends Page<JoomlaTwoColumnsProps> {
    render() {
        return (
            <div className="rt-container">
                <div className="rt-grid-12">
                    <div id="rt-main-column" className="page-content-light">
                        <div className="rt-block component-block" style={{minHeight: "350px"}}>
                            <div style={{position: "absolute", right: "20px", zIndex: 1000}}></div>
                            <div id="rt-mainbody">
                                <div className="component-content rt-joomla">
                                    <div className="rt-joomla">
                                        <table style={{width: "100%:"}}>
                                            <tbody>
                                                <tr>
                                                    <td style={{width: "46%", verticalAlign: "top"}}>{this.props.left}</td>
                                                    <td style={{width: "8%", verticalAlign: "top"}}></td>
                                                    <td style={{verticalAlign: "top"}}>{this.props.right}</td>
                                                </tr>
                                            </tbody>
                                        </table>
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
