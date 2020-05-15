import * as React from "react";

export default class JoomlaBody extends React.Component {
    render() {
        return (<div>
            {/*
            <link rel="stylesheet" href="https://portal2.community-boating.org/ords/cbi_prod/r/files/static/v14Y/tooltip.css" type="text/css" media="screen" />
            <script src="https://portal2.community-boating.org/ords/cbi_prod/r/files/static/v14Y/tooltip.js" type="text/javascript"></script>
            */}
            <div id="rt-bg-surround">
                <div id="rt-bg-pattern" className="main-pattern-dustnscratches">
                    <div className="pattern-gradient"></div>
                </div>
                <div className="rt-container">
                    <div id="rt-drawer">
                        <div className="clear"></div>
                    </div>
                    <div id="rt-page-surround" className="page-overlay-light">
                        <div id="rt-bg-image">
                            <div className="grad-bottom"></div>
                        </div>
                        <div id="rt-topbar">
                            <div id="rt-logo-surround">
                                <div className="rt-block logo-block">
                                    <a href="http://www.community-boating.org" id="rt-logo"></a>
                                </div>
                            </div>
                            <div id="rt-navigation" className="">
                                <div className="rt-block menu-block">
                                    <div className="rt-fusionmenu">
                                        <div className="nopill">
                                            <div className="rt-menubar">
                                            </div>
                                            <div className="clear"></div>
                                        </div>
                                    </div>
                                    <div className="clear"></div>
                                </div>
                            </div>
                        </div>
                        <div id="rt-transition" className="rt-hidden">
                            <div id="rt-showcase" className="showcaseblock-overlay-light">
                                <div className="rt-grid-12 rt-alpha rt-omega">
                                    <div className="rt-block">
                                        <div className="module-surround">
                                            <div className="module-content">
                                                <p>&nbsp;</p>
                                                <p>&nbsp;</p>
                                                <p>&nbsp;</p>
                                                <p>&nbsp;</p>
                                                <p>&nbsp;</p>
                                                <div className="clear"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="clear"></div>
                            </div>
                            <div id="rt-container-bg" className="rt-hidden">
                                <div id="rt-body-surround">
                                    <div id="rt-main" className="mb12">
                                        {this.props.children}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div id="rt-footer-surround">
                        <div id="rt-footer" className="main-bg">
                            <div className="rt-grid-12 rt-alpha rt-omega">
                                <div className="rt-block">
                                    <div className="module-surround">
                                        <div className="module-content">
                                            <p style={{ textAlign: "center" }}><span style={{ fontSize: "10pt" }}>Community Boating, Inc.&nbsp;&nbsp;&nbsp;&nbsp; 21 David Mugar Way, Boston, MA 02114 &nbsp;&nbsp;&nbsp;&nbsp; <a href="http://www.community-boating.org/about-us/hours-and-directions/" target="_blank">Directions</a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 617.523.1038&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <a href="mailto:info@community-boating.org">info@community-boating.org</a></span></p>
                                            <p style={{ textAlign: "center" }}><span style={{ fontSize: "8pt" }}>Community Boating, Inc. operates in association with the <a href="http://www.mass.gov/dcr/">DCR</a> and is a non-profit 501(c)3 organization.</span></p>
                                            <div className="clear"></div>
                                        </div>
                                    </div>
                                </div>

                            </div>
                            <div className="clear"></div>
                        </div>
                    </div>
                </div>
            </div>
            <div id="rt-copyright" className="bottomblock-overlay-dark">
                <div className="rt-container">
                    <div className="rt-grid-12 rt-alpha rt-omega">
                        <div className="rt-block totop-block">
                            <a href="#" id="gantry-totop"><span className="totop-desc">Back to Top</span></a>
                        </div>

                    </div>
                    <div className="clear"></div>
                </div>
            </div>
        </div>
        )
    }
}
