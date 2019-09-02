import * as React from "react";
import { Helmet } from "react-helmet";

class JoomlaHelmet extends React.Component {
    render() {
		const fileRoot = "/joomsource";
        return (
            <div>
                <Helmet>
                    <meta http-equiv="content-type" content="text/html; charset=utf-8" />
                    <title>Community Boating, Inc.</title>





{/*
                    <script src="https://portal2.community-boating.org/i/libraries/apex/minified/desktop_all.min.js?v=18.1.0.00.45"></script>
                    <script src="https://portal2.community-boating.org/ords/wwv_flow.js_messages?p_app_id=620&p_lang=en&p_version=18.1.0.00.45-7038381942104"></script>
                    <script src="https://portal2.community-boating.org/i/libraries/apex/minified/legacy_pre18.min.js?v=18.1.0.00.45"></script>
                    <script src="https://portal2.community-boating.org/i/libraries/apex/minified/legacy_18.min.js?v=18.1.0.00.45"></script>
                    <script src="https://portal2.community-boating.org/i/libraries/jquery-migrate/3.0.0/jquery-migrate-3.0.0.min.js?v=18.1.0.00.45"></script>
*/}

                    <link href={fileRoot + "/favicon.ico"} rel="shortcut icon" type="image/x-icon" />
                    <link rel="stylesheet" href={fileRoot + "/2j_news_slider.css"} type="text/css" />
                    <link rel="stylesheet" href={fileRoot + "/rokbox-style.css"} type="text/css" />
                    <link rel="stylesheet" href={fileRoot + "/gantry.css"} type="text/css" />
                    <link rel="stylesheet" href={fileRoot + "/grid-12.css"} type="text/css" />
                    <link rel="stylesheet" href={fileRoot + "/joomla.css"} type="text/css" />
                    <link rel="stylesheet" href={fileRoot + "/joomla.css"} type="text/css" />
                    <link rel="stylesheet" href={fileRoot + "/overlays.css"} type="text/css" />
                    <link rel="stylesheet" href={fileRoot + "/typography.css"} type="text/css" />
                    <link rel="stylesheet" href={fileRoot + "/extensions.css"} type="text/css" />
                    <link rel="stylesheet" href={fileRoot + "/extensions-overlays.css"} type="text/css" />
                    <link rel="stylesheet" href={fileRoot + "/demo-styles.css"} type="text/css" />
                    <link rel="stylesheet" href={fileRoot + "/template.css"} type="text/css" />
                    <link rel="stylesheet" href={fileRoot + "/template-webkit.css"} type="text/css" />
                    <link rel="stylesheet" href={fileRoot + "/fusionmenu.css"} type="text/css" />

                    <link rel="stylesheet" href="/i/app_ui/css/Core.min.css" type="text/css" />


                    <script type="text/javascript" src={fileRoot + "/jq_last.js"}></script>
                    <script type="text/javascript" src={fileRoot + "/j.e.js"}></script>
                    <script type="text/javascript" src={fileRoot + "/jq.w.js"}></script>

                    <script type="text/javascript" src={fileRoot + "/mootools.js"}></script>

                    <script type="text/javascript" src={fileRoot + "/caption.js"}></script>
                    <script type="text/javascript" src={fileRoot + "/rokbox.js"}></script>
                    <script type="text/javascript" src={fileRoot + "/rokbox-config.js"}></script>
                    <script type="text/javascript" src={fileRoot + "/gantry-totop.js"}></script>
                    <script type="text/javascript" src={fileRoot + "/gantry-buildspans.js"}></script>
                    <script type="text/javascript" src={fileRoot + "/gantry-smartload.js"}></script>
                    <script type="text/javascript" src={fileRoot + "/load-transition.js"}></script>
                    <script type="text/javascript" src={fileRoot + "/fusion.js"}></script>

                    <script type="text/javascript">{`
                        /* BEGIN AG Google Analytics Plugin v.1.0.8 */
                        var _gaq = _gaq || [];
                        _gaq.push(['_setAccount', 'UA-30453164-1']);
                        _gaq.push(['_setCustomVar', 1, 'user_ip', '65.96.167.211', 1]);
                        _gaq.push(['_trackPageview']);
                        (function() {
                            var ga = document.createElement('script');
                            ga.type = 'text/javascript';
                            ga.async = true;
                            ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
                            var s = document.getElementsByTagName('script')[0];
                            s.parentNode.insertBefore(ga, s);

                        })();
                        /* END AG Google Analytics Plugin v.1.0.8 */
                        /* ========== www.gordejev.lv =========== */
                    `}</script>
                    <script>{`
                        var hasClicked = false;

                        function submitWrapper(pReq) {
                            if (hasClicked) {
                                return;
                            } else {
                                hasClicked = true;
                                apex.submit(pReq);
                            }
                        }
                    `}</script>



                    <style type="text/css">{`
                    < !-- table.regionlayout {
                        width: 100%;
                    }

                    #rt-bg-surround,
                    .readonstyle-button #rt-main-column .readon,
                    .roknewspager .readon {
                        background-color: #313131;
                    }

                    body .roknewspager-li,
                    body .roknewspager-pages,
                    body .roknewspager-overlay {
                        background-color: #313131;
                    }

                    .module-title .pointer {
                        border-color: #313131;
                    }

                    #rt-bottom,
                    .main-bg a:hover,
                    #rt-footer,
                    .main-bg,
                    .roknewspager .roknewspager-content,
                    .readonstyle-button .main-bg .readon span,
                    .readonstyle-button .main-bg .readon .button {
                        color: #fff;
                    }

                    .main-bg a,
                    .roknewspager .roknewspager-content a {
                        color: #3881EA;
                    }

                    .main-bg .readon {
                        background-color: #3881EA;
                    }

                    .main-bg .readon span,
                    .main-bg .readon .button {
                        color: #fff;
                    }

                    #rt-page-surround {
                        background-color: #eee;
                    }

                    .page-block .rt-block {
                        background-color: #fff;
                    }

                    a,
                    .readonstyle-link .readon .button {
                        color: #2358A6;
                    }

                    #rt-body-surround,
                    a:hover {
                        color: #444;
                    }

                    #rt-header,
                    #rt-header a:hover,
                    #rt-showcase,
                    #rt-showcase a:hover,
                    #rt-feature,
                    #rt-feature a:hover {
                        color: #fff;
                    }

                    #rt-header a,
                    #rt-showcase a,
                    #rt-feature a {
                        color: #fff;
                    }

                    #rt-logo-surround,
                    .menutop li.active.root,
                    .menutop li.root:hover,
                    .menutop li.f-mainparent-itemfocus,
                    .rt-splitmenu .menutop li.active,
                    .rt-splitmenu .menutop li:hover,
                    .fusion-submenu-wrapper,
                    .roknewspager .active .roknewspager-h3,
                    .roknewspager .active .roknewspager-div,
                    .readonstyle-button .readon,
                    .roktabs ul,
                    .roktabs-wrapper .active-arrows,
                    .readonstyle-button #rt-main-column .readon:hover,
                    .module-content ul.menu,
                    .rg-grid-view .tag,
                    .rg-list-view .tag,
                    .rg-detail-slicetag .tag,
                    .rg-detail-filetag .tag,
                    #rt-accessibility #rt-buttons .button,
                    .rg-ss-progress {
                        background-color: #2358A6;
                    }

                    .menutop li>.item,
                    .roknewspager .active .roknewspager-content,
                    body ul.roknewspager-numbers li,
                    body .roknewspager-numbers li.active,
                    #rt-body-surround .roknewspager .roknewspager-h3 a,
                    .readonstyle-button .readon span,
                    .readonstyle-button .readon .button,
                    .roktabs-wrapper .roktabs-links ul,
                    #rt-body-surround .module-content ul.menu a:hover,
                    .rg-grid-view .tag,
                    .rg-list-view .tag,
                    .rg-detail-slicetag .tag,
                    .rg-detail-filetag .tag {
                        color: #fff;
                    }

                    .roknewspager .active a,
                    .module-content ul.menu a,
                    .module-content ul.menu .item,
                    .module-content ul.menu .separator {
                        color: #B0CEF5;
                    }

                    body ul.triangle-small li:after,
                    body ul.triangle li:after,
                    body ul.triangle-large li:after {
                        border-left-color: #2358A6;
                    }

                    body ul.checkmark li:after,
                    body ul.circle-checkmark li:before,
                    body ul.square-checkmark li:before,
                    body ul.circle-small li:after,
                    body ul.circle li:after,
                    body ul.circle-large li:after {
                        border-color: #2358A6;
                    }

                    body {
                        background-color: #181818;
                    }

                    #rt-copyright,
                    #rt-copyright a:hover {
                        color: #aaa;
                    }

                    #rt-copyright a {
                        color: #3881EA;
                    }

                    #rt-body-surround .box1 .rt-block,
                    .readonstyle-button .main-bg .box1 .readon {
                        background-color: #313131;
                    }

                    .box1,
                    .box1 .readon span,
                    .box1 .readon .button,
                    .box1 a:hover,
                    #rt-page-surround .box1 a:hover {
                        color: #fff;
                    }

                    .box1 a {
                        color: #3881EA;
                    }

                    .main-bg .box1 .rt-block {
                        background-color: #fff;
                    }

                    .main-bg .box1 a {
                        color: #2358A6;
                    }

                    .main-bg .box1,
                    .main-bg .box1 a:hover,
                    #rt-bottom.main-bg .box1 a:hover,
                    #rt-footer.main-bg .box1 a:hover {
                        color: #444;
                    }

                    #rt-content-top .ribbon .module-surround,
                    #rt-content-bottom .ribbon .module-surround,
                    .box2 .rt-block,
                    .box3 .rt-block,
                    .title2 .module-title,
                    .readonstyle-button #rt-main-column .box1 .readon {
                        background-color: #2358A6;
                    }

                    #rt-content-top .ribbon .rt-block,
                    #rt-content-bottom .ribbon .rt-block,
                    .box2,
                    .box2 a:hover,
                    .box3,
                    .box3 a:hover,
                    .ribbon #roktwittie,
                    .title2 h2.title,
                    .ribbon #roktwittie .title,
                    .ribbon #roktwittie .roktwittie-infos,
                    #rt-body-surround .ribbon a:hover {
                        color: #fff;
                    }

                    .box2 a,
                    .box3 a,
                    .ribbon a,
                    .ribbon #roktwittie .roktwittie-infos a {
                        color: #B0CEF5;
                    }

                    .title2 .accent,
                    body ul.checkmark li:after,
                    body ul.circle-checkmark li:before,
                    body ul.square-checkmark li:before,
                    body ul.circle-small li:after,
                    body ul.circle li:after,
                    body ul.circle-large li:after {
                        border-color: #2358A6;
                    }

                    body ul.triangle-small li:after,
                    body ul.triangle li:after,
                    body ul.triangle-large li:after {
                        border-left-color: #2358A6;
                    }

                    .main-overlay-dark.readonstyle-button .main-bg .box1 .readon:hover,
                    .main-overlay-light.readonstyle-button .main-bg .box1 .readon:hover {
                        background-color: #2358A6;
                    }

                    .readonstyle-button .main-bg .box1 .readon:hover span,
                    .readonstyle-button .main-bg .box1 .readon:hover .button {
                        color: #fff;
                    }


                    /* Chrome */

                    .grad-bottom {
                        background: linear-gradient(top, rgba(238, 238, 238, 0) 0%, rgba(238, 238, 238, 1) 100%);
                        background: -webkit-linear-gradient(top, rgba(238, 238, 238, 0) 0%, rgba(238, 238, 238, 1) 100%);
                    }

                    .pattern-gradient {
                        background: linear-gradient(top, rgba(49, 49, 49, 0) 0%, rgba(49, 49, 49, 1) 100%);
                        background: -webkit-linear-gradient(top, rgba(49, 49, 49, 0) 0%, rgba(49, 49, 49, 1) 100%);
                    }

                    /* FF */

                    .grad-bottom {
                        background: linear-gradient(top, rgba(238, 238, 238, 0) 0%, rgba(238, 238, 238, 1) 100%);
                        background: -moz-linear-gradient(top, rgba(238, 238, 238, 0) 0%, rgba(238, 238, 238, 1) 100%);
                    }

                    .pattern-gradient {
                        background: linear-gradient(top, rgba(49, 49, 49, 0) 0%, rgba(49, 49, 49, 1) 100%);
                        background: -moz-linear-gradient(top, rgba(49, 49, 49, 0) 0%, rgba(49, 49, 49, 1) 100%);
                    }

                    /* IE */

                    .grad-bottom {
                        filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#00eeeeee', endColorstr='#eeeeee', GradientType=0);
                    }

                    .pattern-gradient {
                        filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#00313131', endColorstr='#313131', GradientType=0);
                    }


                    #rt-bg-image {
                        background: url(/joomsource/jpback.jpg) no-repeat;
                        background-size: 100%;
                    }

                    #rt-bg-image {
                        position: absolute;
                        width: 1080px;
                        height: 520px;
                        top: 0;
                        left: 50%;
                        margin-left: -540px;
                    }

                    body #rt-logo {
                        width: 204px;
                        height: 79px;
                    }

                    .article-body {
                        font-size: 1.3em;
                    }

                    -->
                `}</style>
                    <style>{`
                    div.wizardProgress {
                        width: 100%;
                        position: relative;
                        overflow: hidden;
                        margin: 10px 0 -15px 0;
                    }

                    div.wizardProgress ul {
                        margin: 0;
                        padding: 0;
                        clear: left;
                        float: left;
                        position: relative;
                        left: 50%;
                    }


                    div.wizardProgress ul li {
                        float: left;
                        display: block;
                        position: relative;
                        right: 50%;
                        background: url(/i/apex_ui/apex_ui.png) 50% -300px no-repeat;
                    }

                    div.wizardProgress ul li.first-non-current,
                    div.wizardProgress ul li.first-current {
                        background: url(/i/apex_ui/apex_ui.png) 50% -236px no-repeat;
                    }

                    div.wizardProgress ul li.last-non-current,
                    div.wizardProgress ul li.last-current {
                        background: url(/i/apex_ui/apex_ui.png) 50% -364px no-repeat;
                    }

                    div.wizardProgress ul li span {
                        display: block;
                        float: left;
                        padding: 36px 4px 0 4px;
                        font-size: 12px;
                        line-height: 14px;
                        color: #404040;
                        background-image: url(/i/apex_ui/apex_ui.png);
                        background-repeat: no-repeat;
                        text-align: center;
                        overflow: hidden;
                        min-width: 100px;
                        max-width: 160px;
                    }

                    div.wizardProgress ul li.current span,
                    div.wizardProgress ul li.first-current span,
                    div.wizardProgress ul li.last-current span {
                        color: #333;
                        font-weight: bold;
                        background-position: 50% -556px;
                    }

                    div.wizardProgress ul li.non-current span,
                    div.wizardProgress ul li.first-non-current span,
                    div.wizardProgress ul li.last-non-current span {
                        background-position: 50% -428px;
                    }


                    div.wizardProgress ul li.non-current span.pastCurrent,
                    div.wizardProgress ul li.first-non-current span.pastCurrent,
                    div.wizardProgress ul li.last-non-current span.pastCurrent {
                        background-position: 50% -492px;
                    }
                `}</style>
                </Helmet>
                {this.props.children}
            </div>
        );
    }
};

class JoomlaBody extends React.Component {
    render() {
        return (<div>
            <div id="dhtmltooltip"></div>
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

export default class JoomlaBase extends React.Component {
    render() {
        return (
            <JoomlaHelmet>
					<JoomlaBody>
						{this.props.children}
					</JoomlaBody>
				</JoomlaHelmet>
        )
    }
}