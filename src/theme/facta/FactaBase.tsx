import * as React from "react";
import { Helmet } from "react-helmet";
import asc from "../../app/AppStateContainer";
import { logout } from "../../async/logout";

class FactaHelmet extends React.Component {
	render() {
		const fileRoot = "/joomsource";
		return (
			<React.Fragment>
				<Helmet>
					<meta charSet="UTF-8" />
					<link rel="icon" type="image/png" sizes="32x32" href="http://cbi.flywheelsites.com/wp-content/themes/custom/assets/images/favicon/favicon-32x32.png" />
					<link rel="icon" type="image/png" sizes="16x16" href="http://cbi.flywheelsites.com/wp-content/themes/custom/assets/images/favicon/favicon-16x16.png" />
					<meta name="viewport" content="width=device-width, initial-scale=1.0" />
					<title>Membership Prices - Community Boating Incorporated</title>

					<link rel="canonical" href="http://cbi.flywheelsites.com/adult/membership-prices/" />
					<meta property="og:locale" content="en_US" />
					<meta property="og:type" content="article" />
					<meta property="og:title" content="Membership Prices - Community Boating Incorporated" />
					<meta property="og:description" content="Membership Options A Community Boating membership or pass is the easiest, most affordable way to sail or paddle in Greater Boston. Adult members have unlimited daily access to our fleet, and our classes and racing groups will help you hone your skills and meet other sailors. Plus, we host a robust calendar of dock parties &hellip;" />
					<meta property="og:url" content="http://cbi.flywheelsites.com/adult/membership-prices/" />
					<meta property="og:site_name" content="Community Boating Incorporated" />
					<meta name="twitter:card" content="summary_large_image" />
					<meta name="twitter:description" content="Membership Options A Community Boating membership or pass is the easiest, most affordable way to sail or paddle in Greater Boston. Adult members have unlimited daily access to our fleet, and our classes and racing groups will help you hone your skills and meet other sailors. Plus, we host a robust calendar of dock parties [&hellip;]" />
					<meta name="twitter:title" content="Membership Prices - Community Boating Incorporated" />
					<script type='application/ld+json' className='yoast-schema-graph yoast-schema-graph--main'>
						{`
							{"@context":"https://schema.org","@graph":[{"@type":"WebSite","@id":"http://cbi.flywheelsites.com/#website","url":"http://cbi.flywheelsites.com/","name":"Community Boating Incorporated","potentialAction":{"@type":"SearchAction","target":"http://cbi.flywheelsites.com/?s={search_term_string}","query-input":"required name=search_term_string"}},{"@type":"WebPage","@id":"http://cbi.flywheelsites.com/adult/membership-prices/#webpage","url":"http://cbi.flywheelsites.com/adult/membership-prices/","inLanguage":"en-US","name":"Membership Prices - Community Boating Incorporated","isPartOf":{"@id":"http://cbi.flywheelsites.com/#website"},"datePublished":"2020-05-20T22:02:08+00:00","dateModified":"2020-05-23T14:23:07+00:00"}]}
						`}
					</script>

					<link rel='dns-prefetch' href='//ajax.googleapis.com' />
					<link rel='dns-prefetch' href='//cdnjs.cloudflare.com' />
					<link rel='dns-prefetch' href='//stackpath.bootstrapcdn.com' />
					<link rel='dns-prefetch' href='//cdn.jsdelivr.net' />
					<link rel='dns-prefetch' href='//fonts.googleapis.com' />
					<link rel='stylesheet' id='fonts-css' href='https://fonts.googleapis.com/css?family=Open+Sans+Condensed%3A300%2C700%7COpen+Sans%3A300%2C300i%2C400%2C400i%2C600%2C600i%2C700%2C700i&#038;display=swap&#038;ver=5.4.1' type='text/css' media='all' />
					<link rel='stylesheet' id='styles-css' href='/facta/assets/css/app.css' type='text/css' media='all' />
					<link rel='stylesheet' id='edits-css' href='/facta/assets/css/edits.css' type='text/css' media='all' />
					<link rel='stylesheet' id='photoswipe-main-css' href='http://cbi.flywheelsites.com/wp-content/themes/custom/assets/library/vendor/PhotoSwipe/photoswipe.css?ver=5.4.1' type='text/css' media='all' />
					<link rel='stylesheet' id='photoswipe-skin-css' href='http://cbi.flywheelsites.com/wp-content/themes/custom/assets/library/vendor/PhotoSwipe/default-skin/default-skin.css?ver=5.4.1' type='text/css' media='all' />
					<script type='text/javascript' src='https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js?ver=5.4.1'></script>
					<script type='text/javascript' src='https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.7/umd/popper.min.js?ver=5.4.1'></script>
					{/* <script type='text/javascript' src='https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js?ver=5.4.1'></script> */}
					<script type='text/javascript' src='https://cdnjs.cloudflare.com/ajax/libs/gsap/2.1.3/TweenMax.min.js?ver=5.4.1'></script>
					<script type='text/javascript' src='https://cdnjs.cloudflare.com/ajax/libs/gsap/2.1.3/plugins/ScrollToPlugin.min.js?ver=5.4.1'></script>
					{/* <script type='text/javascript' src='https://cdn.jsdelivr.net/npm/slick-carousel@1.8.1/slick/slick.min.js?ver=5.4.1'></script> */}
					{/* <script type='text/javascript' src='https://cdnjs.cloudflare.com/ajax/libs/jquery.hoverintent/1.10.0/jquery.hoverIntent.min.js?ver=5.4.1'></script> */}
					<script type='text/javascript' src='https://cdnjs.cloudflare.com/ajax/libs/js-cookie/2.2.1/js.cookie.min.js?ver=5.4.1'></script>
					{/* <script type='text/javascript' src='https://cdnjs.cloudflare.com/ajax/libs/sticky-kit/1.1.3/sticky-kit.min.js?ver=5.4.1'></script> */}
					<script type='text/javascript' src='http://cbi.flywheelsites.com/wp-content/themes/custom/assets/js/library/fontawesome.min.js?ver=5.4.1'></script>
					<script type='text/javascript' src='http://cbi.flywheelsites.com/wp-content/themes/custom/assets/js/library/magnific-popup.js?ver=5.4.1'></script>
					<script type='text/javascript' src='http://cbi.flywheelsites.com/wp-content/themes/custom/assets/library/vendor/PhotoSwipe/photoswipe.min.js?ver=5.4.1'></script>
					<script type='text/javascript' src='http://cbi.flywheelsites.com/wp-content/themes/custom/assets/library/vendor/PhotoSwipe/photoswipe-ui-default.min.js?ver=5.4.1'></script>
					<script type='text/javascript' src='http://cbi.flywheelsites.com/wp-content/themes/custom/assets/js/vendor.min.js?ver=1590961919'></script>
					<link rel='shortlink' href='http://cbi.flywheelsites.com/?p=1165' />
					<meta name="generator" content="Site Kit by Google 1.6.0" /><meta name="google-site-verification" content="Gl6xsj1u0eq_WY3gOACWkcytcq80VTf3WVrved7xvKA" />

					<body className="page-template-default page page-id-1165 page-child parent-pageid-76">
					</body>

				</Helmet>
				{this.props.children}
			</React.Fragment>
		);
	}
};

export class FactaBody extends React.Component {
	render() {
		return <div>
			<noscript>You need to enable JavaScript to run this app.</noscript>

			<div id="dhtmltooltip"></div>
			<script type="text/javascript" src="/joomsource/tooltip.js"></script>
			<header className="header" role="banner">
				<div className='header-utility'>
					<div className='header-utility-icon'><a href='/about-us/weather-information/'><svg viewBox="0 0 50 35"
						fill="none" xmlns="http://www.w3.org/2000/svg">
						<g clipPath="url(#clip0)">
							<path d="M0.600098 0.719971L47.4701 16.94L0.730098 33.78L0.600098 0.719971Z" fill="white" />
							<path d="M23.6501 8.59003L0.900098 16.84L0.600098 0.840027L23.6501 8.59003Z"
								fill="#306D10" />
							<path opacity="0.9" d="M23.6501 25.1L0.900098 33.35L0.600098 17.35L23.6501 25.1Z"
								fill="#F25151" />
							<path d="M0 34.71V0L49.55 17L0 34.71ZM1.2 1.68V33.01L45.94 17.02L1.2 1.68Z" fill="white" />
							<path d="M23.432 8.03225L0.345215 16.9521L0.777695 18.0715L23.8645 9.15161L23.432 8.03225Z"
								fill="white" />
							<path d="M1.0069 16.2428L0.585938 17.3666L23.6145 25.9928L24.0354 24.869L1.0069 16.2428Z"
								fill="white" />
							<path
								d="M25.0599 15.05C24.9599 14.88 24.8299 14.74 24.6799 14.62C24.5299 14.49 24.3499 14.4 24.1599 14.33C23.9699 14.26 23.7599 14.23 23.5499 14.23C23.1599 14.23 22.8299 14.31 22.5599 14.46C22.2899 14.61 22.0699 14.81 21.8999 15.06C21.7299 15.31 21.6099 15.6 21.5299 15.92C21.4499 16.24 21.4099 16.58 21.4099 16.92C21.4099 17.25 21.4499 17.57 21.5299 17.88C21.6099 18.19 21.7299 18.47 21.8999 18.72C22.0699 18.97 22.2899 19.17 22.5599 19.32C22.8299 19.47 23.1599 19.55 23.5499 19.55C24.0799 19.55 24.4899 19.39 24.7899 19.07C25.0899 18.75 25.2699 18.32 25.3299 17.79H26.9999C26.9599 18.28 26.8399 18.72 26.6599 19.12C26.4799 19.52 26.2299 19.85 25.9299 20.13C25.6299 20.41 25.2799 20.62 24.8699 20.77C24.4699 20.92 24.0199 20.99 23.5399 20.99C22.9399 20.99 22.3999 20.89 21.9199 20.68C21.4399 20.47 21.0399 20.18 20.7099 19.82C20.3799 19.46 20.1299 19.02 19.9499 18.53C19.7699 18.04 19.6899 17.5 19.6899 16.93C19.6899 16.34 19.7799 15.8 19.9499 15.3C20.1299 14.8 20.3799 14.36 20.7099 13.99C21.0399 13.62 21.4499 13.32 21.9199 13.11C22.3999 12.9 22.9399 12.79 23.5399 12.79C23.9699 12.79 24.3799 12.85 24.7699 12.98C25.1499 13.1 25.4999 13.29 25.7999 13.52C26.0999 13.76 26.3599 14.05 26.5499 14.41C26.7399 14.77 26.8699 15.16 26.9199 15.62H25.2499C25.2299 15.4 25.1699 15.22 25.0599 15.05Z"
								fill="#00507D" />
						</g>
						<defs>
							<clipPath id="clip0">
								<rect width="49.55" height="34.71" fill="white" />
							</clipPath>
						</defs>
					</svg></a></div>

					<div className='header-utility-items'>
						{
							asc.state.login.authenticatedUserName.isSome()
							? <div className='header-utility-item'>
								<a href='#' onClick={e => {
									e.preventDefault();
									logout.send({type: "json", jsonData: {}}).then(() => {
										asc.updateState.login.logout()
									})
								}}>
									<div className='header-utility-item-icon'><svg viewBox="0 0 17 17" fill="none"
										xmlns="http://www.w3.org/2000/svg">
										<g>
											<path
												d="M16.08 14.34C15.29 13.05 13.65 13.02 12.38 12.67C10.93 12.27 9.72996 11.71 10.18 9.97C10.36 9.27 10.83 8.74 11.15 8.09C11.5 7.36 11.72 6.52 11.78 5.74C11.84 5.05 11.77 4.32 11.74 3.64C11.7 2.86 11.51 2.46 11.06 1.83C10.51 1.06 9.35996 0.1 8.29996 0.01V0C8.28996 0 8.24996 0 8.21996 0H8.18995H8.17996C8.15996 0 8.14996 0 8.13996 0V0.01C8.12996 0.01 8.10995 0.01 8.10995 0.01C7.03995 0.09 5.87996 1.06 5.31996 1.83C4.86996 2.46 4.67996 2.86 4.63996 3.64C4.60996 4.31 4.53996 5.04 4.59996 5.74C4.66996 6.53 4.87996 7.37 5.22996 8.09C5.54996 8.75 6.00995 9.27 6.19995 9.98C6.64995 11.72 5.44995 12.28 3.99995 12.68C2.72995 13.03 1.08996 13.06 0.299955 14.35C0.0699551 14.73 -0.200045 15.79 0.239955 16.14C0.619955 16.44 1.78995 16.38 2.28995 16.38C3.51995 16.38 6.97995 16.39 8.19995 16.39C9.63996 16.39 12.97 16.38 14.11 16.38C14.61 16.38 15.78 16.44 16.16 16.14C16.58 15.78 16.32 14.73 16.08 14.34Z"
												fill="white" />
										</g>
										<defs>
											<clipPath id="clip0">
												<rect width="16.38" height="16.38" fill="white" />
											</clipPath>
										</defs>
									</svg></div>
									<div className='header-utility-item-text d-none d-sm-block'>Logout</div>
								</a>
							</div>
							: null
						}
						
					</div>
				</div>

				<div className='header-utility-dropdown'>
					<div className='container-fluid p-0'>
						<div className='row no-gutters'>
							<div className='col-5'>
								<div className='header-utility-dropdown-map'>
									<div className='cover'
										style={{ backgroundImage: "url(http://cbi.flywheelsites.com/wp-content/themes/custom/assets/images/map.png)" }}>
									</div>
								</div>
							</div>
							<div className='col'>
								<div className='header-utility-dropdown-content'>
									<div className='header-utility-dropdown-title'>Come Visit Us!</div>
									<div className='header-utility-dropdown-body'>
										<p><strong>Community Boating Inc.</strong><br />
											21 David G Mugar Way, Boston MA 02114</p><br />
										<p><strong>Phone:</strong> (617) 523-1038</p>
										<p><strong>Email:</strong> info@community-boating.org</p>
									</div>
									<div className='header-utility-dropdown-cta'>
										<div className='row'>
											<div className='col-auto'>
												<a href='/about-us/hours-and-directions/'>See All Hours</a>
											</div>
											<div className='col-auto'>
												<a href='/about-us/hours-and-directions/'>Get Directions</a>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>



				<nav className="nav" role="navigation">
					<div className='container-fluid'>
						<div className="row no-gutters align-items-center">
							<div className="col">
								<a href='/' className='nav-logo' style={{marginLeft: "30px"}}>
									<svg viewBox="0 0 440 167" fill="none" xmlns="http://www.w3.org/2000/svg" style={{height: "70px"}}>
										<g>
											<path
												d="M186.39 9.87C183.96 8.49 181.21 7.77 178.41 7.79C169.17 7.79 161.6 14.85 161.6 23.71C161.6 32.41 169.06 39.23 178.08 39.23C180.98 39.25 183.83 38.54 186.38 37.16V32.71C184.05 34.74 181.08 35.88 177.99 35.91C171.19 35.88 165.71 30.35 165.73 23.56C165.76 16.76 171.29 11.28 178.08 11.3C181.1 11.31 184.03 12.36 186.38 14.26V9.87H186.39ZM209.4 7.79C200.38 7.79 192.82 14.91 192.82 23.51C192.82 32.51 200.28 39.23 209.4 39.23C218.52 39.23 225.98 32.51 225.98 23.51C225.99 14.91 218.52 7.79 209.4 7.79ZM209.4 35.77C202.54 35.85 196.9 30.37 196.8 23.51C196.84 16.75 202.34 11.31 209.1 11.35C209.22 11.35 209.33 11.35 209.45 11.36C216.91 11.36 222.1 16.89 222.1 23.52C221.99 30.4 216.33 35.89 209.46 35.78H209.4V35.77ZM248.58 39.23L258.11 18.67L261.84 38.64H265.89L259.5 7.2L248.58 30.93L237.71 7.2L231.31 38.64H235.35L239.08 18.67H239.19L248.62 39.23H248.58V39.23ZM290.36 39.23L299.68 18.67H299.79L303.52 38.64H307.56L301.16 7.2L290.4 30.93L279.48 7.2L273.08 38.64H277.12L280.85 18.67H280.96L290.4 39.23H290.36V39.23ZM315.34 8.45V27.56C315.34 34.19 319.69 39.23 326.95 39.23C334.21 39.23 338.46 34.2 338.46 27.56V8.45H334.51V26.28C334.51 31.22 332.96 35.77 326.95 35.77C320.94 35.77 319.27 31.22 319.27 26.28V8.45H315.34ZM346.75 38.61H350.7V16.19L374.33 39.82V8.45H370.39V30.73L346.75 7V38.64V38.61ZM387.39 8.06H383.42V38.25H387.37V8.09L387.39 8.06ZM404.08 11.92H411.54V8.45H392.66V11.92H400.12V38.58H404.07V11.92H404.08ZM425.73 25.51V38.64H429.68V25.51L439.94 8.45H435.38L427.71 21.25L419.94 8.45H415.42L425.73 25.51Z"
												fill="#00507D" />
											<path fillRule="evenodd" clipRule="evenodd"
												d="M52.1301 7.33997L52.3401 144.19L116.45 144.23C116.45 144.24 61.3701 23.53 52.1301 7.33997Z"
												fill="url(#paint0_linear)" />
											<path fillRule="evenodd" clipRule="evenodd"
												d="M34.0801 115.1L51.2201 67.7701L82.5001 154L87.9101 152.81L51.9601 58.9001V6.43008L49.1401 0.0800781V62.1001L32.5801 106.02C32.5801 106.02 34.0401 115.15 34.0801 115.1Z"
												fill="#EAEFF2" />
											<path fillRule="evenodd" clipRule="evenodd"
												d="M50.5601 144.29C50.5601 144.29 5.09007 145.96 2.22007 146.46C2.22007 146.46 0.81007 146.46 3.13007 141.54C5.46007 136.62 45.2701 42.22 45.2701 42.22C45.2701 42.22 13.1101 110.35 50.5601 144.29Z"
												fill="url(#paint1_linear)" />
											<path d="M51.8 27.5701L122.02 152.25L121.23 152.65L51.01 27.9301L51.8 27.5701Z"
												fill="#00507D" />
											<path d="M51.6401 30.47L115.49 152.41L114.7 152.77L50.8801 30.83L51.6401 30.47Z"
												fill="#00507D" />
											<path d="M51.4699 34.09L110.42 152.65L109.62 152.96L50.6699 34.44L51.4699 34.09Z"
												fill="#00507D" />
											<path d="M51.7199 37.26L105.92 153.12L105.14 153.48L50.9299 37.58L51.7199 37.26Z"
												fill="#00507D" />
											<path d="M101.34 153.64L50.9299 40.71L51.7199 40.35L102.18 153.32L101.34 153.64Z"
												fill="#00507D" />
											<path d="M51.4301 43.65L98.2301 153.32L97.4401 153.64L50.5901 43.92L51.4301 43.65Z"
												fill="#00507D" />
											<path d="M93.9401 154.03L50.8401 47.62L51.6401 47.3L94.7701 153.71L93.9401 154.03Z"
												fill="#00507D" />
											<path
												d="M51.6401 50.4301L91.6901 153.95L90.9101 154.23L50.8401 50.7101L51.6401 50.4301Z"
												fill="#00507D" />
											<path d="M51.7201 53.84L89.0701 154.15L88.2901 154.43L50.8801 54.12L51.7201 53.84Z"
												fill="#00507D" />
											<path fillRule="evenodd" clipRule="evenodd"
												d="M0.0500399 147.48C0.0500399 147.48 20.43 152.84 53.88 153.39C62.41 153.52 70.17 153.56 77.18 153.52L47.6 66.07L32.8 106.26L32.42 95.12L45.72 59.32V6.31002L48.97 1.94405e-05C48.68 -0.0399806 48.8 61.66 48.8 61.66L82.62 153.49C100.01 153.33 112.49 152.74 121.81 152.3L120.97 160.59C120.97 160.59 60.42 167.16 40.48 166.13C20.54 165.1 10.34 163.83 8.20004 163.15C6.06004 162.47 6.12004 163.15 3.54004 158.83C0.97004 154.52 -0.27996 149.71 0.0500399 147.48Z"
												fill="#00507D" />
											<path
												d="M167.41 58.9301H169.07C174.46 58.9301 178.91 59.9101 178.91 65.7401C178.91 71.7801 174.45 72.7701 168.96 72.7701H167.4V58.9101L167.41 58.9301ZM167.41 76.9201H171.05C176.23 76.9201 182.97 78.2101 182.97 84.0401C182.97 89.8701 177.26 91.5001 171.87 91.5001H167.41V76.9201ZM161.61 96.1201H172.5C180.79 96.1201 188.77 92.7601 188.77 84.4501C188.62 79.1201 184.7 74.6501 179.44 73.7901V73.6901C182.48 72.2301 184.42 69.1501 184.42 65.7801C184.42 56.2901 176.12 54.3201 167.36 54.3201H161.65V96.1401L161.61 96.1201ZM219.55 53.4101C206.18 53.4101 195.09 63.1901 195.09 75.1501C195.09 87.6101 205.97 97.0001 219.55 97.0001C233.14 97.0001 244 87.5901 244 75.1401C244 63.1701 232.91 53.4001 219.54 53.4001L219.55 53.4101ZM219.55 92.1601C209.39 92.1601 200.89 84.7001 200.89 75.1001C200.89 65.9101 208.56 58.2001 219.55 58.2001C230.54 58.2001 238.2 65.9101 238.2 75.1001C238.21 84.6901 229.61 92.1601 219.55 92.1601ZM277.07 85.6201L282.4 96.1001H288.62L266.31 52.5001L244.01 96.1101H250.33L255.61 85.6301H277.07V85.6201ZM274.57 80.8801H258.01L266.31 63.8201L274.6 80.8801H274.57ZM304.96 59.0401V96.1201H299.16V59.0401H288.18V54.2801H316.06V59.0401H304.96ZM326.94 54.2901H321.14V96.1101H326.94V54.2801V54.2901ZM339.38 96.1201H345.19V64.8601L380.33 97.9201V54.2801H374.53V85.1301L339.33 52.2001V96.1001L339.38 96.1201ZM416.3 75.5401V80.3601H428.43C428.23 87.1701 420.35 92.7201 413.1 92.7201C403.04 92.7201 394.97 84.4101 394.97 75.6601C394.97 66.3601 403.15 58.7501 413.62 58.7501C419.29 58.7701 424.66 61.2601 428.34 65.5801L432.39 62.0201C427.48 56.7801 420.6 53.8401 413.42 53.9201C399.94 53.9201 389.16 63.8101 389.16 75.8701C389.16 87.4401 399.74 97.6201 412.79 97.6201C425.84 97.6201 434.91 88.6901 434.91 77.2301V75.5501L416.3 75.5401Z"
												fill="#00507D" />
											<path
												d="M165.45 142.4H166.27C169.07 142.4 171.25 142.9 171.25 145.96C171.25 149.02 168.97 149.61 166.27 149.61H165.45V142.39V142.4ZM165.45 151.7H167.32C169.91 151.7 173.32 152.39 173.32 155.36C173.32 158.32 170.43 159.21 167.73 159.21H165.45V151.75V151.7ZM162.54 161.58H168.03C172.18 161.58 176.22 159.91 176.22 155.54C176.14 152.82 174.14 150.54 171.45 150.11V150C173.03 149.27 174.05 147.69 174.04 145.95C174.04 141.01 169.77 140.02 165.43 140.02H162.53L162.54 161.58ZM220.9 140.73C214.27 140.73 208.67 145.77 208.67 152C208.67 158.4 214.16 163.27 220.9 163.27C227.64 163.27 233.24 158.42 233.24 152C233.24 145.77 227.64 140.73 220.9 140.73ZM220.9 160.7C215.82 160.7 211.57 156.84 211.57 152C211.57 147.16 215.41 143.2 220.9 143.2C226.39 143.2 230.34 147.16 230.34 152C230.34 156.84 226.07 160.7 220.9 160.7ZM279.99 143.39C278.72 141.3 276.42 140.05 273.98 140.13C270.45 140.13 267.04 142.21 267.04 145.66C267.04 148.73 269.52 150.12 272.12 151.21L273.77 151.8C275.9 152.59 277.82 153.58 277.82 155.96C277.76 158.31 275.81 160.16 273.46 160.11C271.11 160.27 269.07 158.5 268.91 156.15C268.91 156.12 268.91 156.09 268.9 156.06L265.99 156.66C266.53 160.22 269.65 162.81 273.25 162.69C277.52 162.69 280.71 159.82 280.71 155.97C280.71 152.31 278.21 150.64 274.9 149.44L273.25 148.84C271.8 148.35 269.93 147.45 269.93 145.64C269.93 143.83 272 142.58 273.87 142.58C275.43 142.52 276.91 143.31 277.71 144.66L279.99 143.37V143.39V143.39ZM321.34 143H326.94V140.63H312.84V143H318.33V162.2H321.34V143ZM369.44 140.13C362.7 140.13 357.11 145.17 357.11 151.4C357.11 157.8 362.6 162.67 369.44 162.67C376.28 162.67 381.78 157.83 381.78 151.4C381.78 145.17 376.18 140.13 369.44 140.13ZM369.44 160.1C364.36 160.1 360.01 156.35 360.01 151.4C360.01 146.65 363.95 142.6 369.44 142.6C374.37 142.38 378.54 146.2 378.76 151.13C378.76 151.22 378.77 151.31 378.77 151.4C378.77 156.35 374.5 160.1 369.44 160.1ZM415.46 161.88H418.36V145.77L435.96 162.77V140.38H433.06V156.29L415.43 139.29L415.46 161.88Z"
												fill="#0292BE" />
											<path d="M437.03 118.97H157.67V120.36H437.03V118.97Z" fill="#00507D" />
										</g>
										<defs>
											<linearGradient id="paint0_linear" x1="52.2645" y1="75.7883" x2="116.58"
												y2="75.7883" gradientUnits="userSpaceOnUse">
												<stop stopColor="#0073AE" />
												<stop offset="1" stopColor="#DCDDDE" />
											</linearGradient>
											<linearGradient id="paint1_linear" x1="12.401" y1="94.3347" x2="40.9383"
												y2="94.3347" gradientUnits="userSpaceOnUse">
												<stop stopColor="#0073AE" />
												<stop offset="1" stopColor="#DCDDDE" />
											</linearGradient>
											<clipPath id="clip0">
												<rect width="439.94" height="166.24" fill="white" />
											</clipPath>
										</defs>
									</svg>
								</a>
							</div>
							<div className="col-auto">
								<div className='row no-gutters d-none d-lg-flex'>


									<div className='col-auto'>
										<div className='nav-item  '>
											<a className='nav-item-parent' href='/ap'>Adult
									Program</a>
										</div>
									</div>

									<div className='col-auto'>
										<div className='nav-item  '>
											<a className='nav-item-parent' href='/jp'>Youth
									Program</a>
										</div>
									</div>
								</div>
								<div className='hamburger-wrapper d-lg-none'>
									<div className='hamburger-text'>Menu</div>
									<div className='hamburger hamburger--main'>
										<div className='rect rect--1'></div>
										<div className='rect rect--2'></div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</nav>

				<div className='nav-mobile'>
					<div className='nav-mobile-items'>

						<div className='nav-item  nav-drops'>
							<a className='nav-item-parent' href='/ap'>Adult Program</a>



						</div>

						<div className='nav-item  nav-drops' data-item='dropdown-3'>
							<a className='nav-item-parent' href='/jp'>Youth</a>



						</div>

					</div>
				</div>

			</header>
			<main role='main' className='main main-single'>

				<div className='page-title'>
					<div className='ratio'></div>
					<div className='cover'
						style={{ backgroundImage: "url(https://www.community-boating.org/wp-content/uploads/IMG_1495-scaled.jpeg)" }}>
					</div>
					<div className='page-title-content'>
						<div className='container'>
							<div className='row'>
								<div className='col-12'>
									<div className='page-title-body'>CBI Membership Portal</div>
								</div>
							</div>
						</div>
					</div>
				</div>

				{this.props.children}

				<script>
					{`
						jQuery(document).ready(function ($) {

							var initPhotoSwipeFromDOM = function (gallerySelector) {
				
								// parse slide data (url, title, size ...) from DOM elements
								// (children of gallerySelector)
								var parseThumbnailElements = function (el) {
									var thumbElements = el.childNodes,
										numNodes = thumbElements.length,
										items = [],
										figureEl,
										linkEl,
										size,
										item;
				
									for (var i = 0; i < numNodes; {
				
										figureEl = thumbElements[i] < figure > element
				
												// include only element nodes
										if (figureEl.nodeType !== 1) {
											continue;
										}
				
										linkEl = figureEl.children[0]; // <a> element
				
									size = linkEl.getAttribute('data-size').split('x');
				
									// create slide object
										item = {
											src: linkEl.getAttribute('href'),
											w: parseInt(size[0], 10),
											h: parseInt(size[1], 10)
										};
				
				
				
										if (figureEl.children.length > 1) {
											// <figcaption> content
											item.title = figureEl.children[1].innerHTML;
										}
				
										if (linkEl.children.length > 0) {
											// <img> thumbnail element, retrieving thumbnail url
											item.msrc = linkEl.children[0].getAttribute('data-src');
										}
				
										item.el = figureEl; // save link to element for getThumbBoundsFn
										items.push(item);
									}
				
									return items;
								};
				
								// find nearest parent element
								var closest = function closest(el, fn) {
									return el && (fn(el) ? el : closest(el.parentNode, fn));
								};
				
								// triggers when user clicks on thumbnail
								var onThumbnailsClick = function (e) {
											e = e || window.event;
									e.preventDefault ? e.preventDefault() : e.returnValue = false;
				
									var eTarget = e.target || e.srcElement;
				
									// find root element of slide
									var clickedListItem = closest(eTarget, function (el) {
										return (el.tagName && el.tagName.toUpperCase() === 'FIGURE');
									});
				
									if (!clickedListItem) {
										return;
									}
				
									// find index of clicked item by looping through all child nodes
									// alternatively, you may define index via data- attribute
									var clickedGallery = clickedListItem.parentNode,
										childNodes = clickedListItem.parentNode.childNodes,
										numChildNodes = childNodes.length,
										nodeIndex = 0,
										index;
				
									for (var i = 0; i < numChildNodes; {
										if (childNodes[i].nodeType !== 1) {
											continue;
										}
				
										if (childNodes[i] === clickedListItem) {
											index = nodeIndex;
											break;
										}
										nodeIndex++;
									}
				
				
				
									if (index >= 0) {
											// open PhotoSwipe if valid index found
											openPhotoSwipe(index, clickedGallery);
									}
									return false;
								};
				
								// parse picture index and gallery index from URL (#&pid=1&gid=2)
								var photoswipeParseHash = function () {
									var hash = window.location.hash.substring(1),
										params = {};
				
									if (hash.length < 5) {
										return params;
									}
				
									var vars = hash.split('&');
									for (var i = 0; i < vars.length; {
										if (!vars[i]) {
											continue;
										}
										var pair = vars[i].split('=');
										if (pair.length < 2) {
											continue;
										}
										params[pair[0]] = pair[1];
									}
				
									if (params.gid) {
											params.gid = parseInt(params.gid, 10);
									}
				
									return params;
								};
				
								var openPhotoSwipe = function (index, galleryElement, disableAnimation, fromURL) {
									var pswpElement = document.querySelectorAll('.pswp')[0],
										gallery,
										options,
										items;
				
									items = parseThumbnailElements(galleryElement);
				
									// define options (if needed)
									options = {
				
											bgOpacity: 0.8,
				
										// define gallery index (for URL)
										galleryUID: galleryElement.getAttribute('data-pswp-uid'),
				
										showHideOpacity: true,
				
										getThumbBoundsFn: function (index) {
											// See Options -> getThumbBoundsFn section of documentation for more info
											//console.log(items[index].el);
											var thumbnail = items[index].el, // find thumbnail
												pageYScroll = window.pageYOffset || document.documentElement.scrollTop,
												rect = thumbnail.getBoundingClientRect();
				
											//console.log(items[index].el);
				
											return {x: rect.left, y: rect.top + pageYScroll, w: rect.width };
										}
				
									};
				
									// PhotoSwipe opened from URL
									if (fromURL) {
										if (options.galleryPIDs) {
											// parse real index when custom PIDs are used
											// http://photoswipe.com/documentation/faq.html#custom-pid-in-url
											for (var j = 0; j < items.length; {
												if (items[j].pid == index) {
											options.index = j;
													break;
												}
											}
										} else {
											// in URL indexes start from 1
											options.index = parseInt(index, 10) - 1;
										}
									} else {
											options.index = parseInt(index, 10);
									}
				
									// exit if index not found
									if (isNaN(options.index)) {
										return;
									}
				
									if (disableAnimation) {
											options.showAnimationDuration = 0;
									}
				
									// Pass data to PhotoSwipe and initialize it
									gallery = new PhotoSwipe(pswpElement, PhotoSwipeUI_Default, items, options);
									gallery.init();
								};
				
								// loop through all gallery elements and bind events
								var galleryElements = document.querySelectorAll(gallerySelector);
				
								for (var i = 0, l = galleryElements.length; i < l; {
											galleryElements[i].setAttribute('data-pswp-uid', i + 1);
									galleryElements[i].onclick = onThumbnailsClick;
								}
				
								// Parse URL and open gallery if it contains #&pid=3&gid=1
								var hashData = photoswipeParseHash();
								if (hashData.pid && hashData.gid) {
											openPhotoSwipe(hashData.pid, galleryElements[hashData.gid - 1], true, true);
								}
							};
				
							// execute above function
							initPhotoSwipeFromDOM('.block-gallery');
				
						});
					`}

				</script>

			</main>
			<div className='legal'>
				<div className='container'>
					<div className="row">
						<div className="col-auto">
							© 2020 Community Boating, Inc. CBI is a 501(c)(3) non-profit corporation.
						</div>
						<div className="col">
							<div className="row justify-content-center">
								<div className="col-auto">
									<a href='/privacy-policy/'>Privacy Policy</a>
								</div>
								<div className="col-auto">
									<a href='/sitemap/'>Sitemap</a>
								</div>
								<div className="col-auto">
									<a href='/terms-of-use/'>Terms of Use</a>
								</div>
								<div className="col-auto">
									<a href='/about-us/contact-us/'>Contact Us</a>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div id="pop-search" className="mfp-hide">
					<form role="search" id="pop-search-form" className='site-search-form'>
						<div className="form-group">
							<label htmlFor="pop-search-input">
								<i className="fad fa-file-search"></i>
								<span>Search Community Boating</span>
							</label>
							<div className="input-group">
								<input id='pop-search-input' type="text" className="form-control site-search-input"
									placeholder="Search Community Boating..." aria-label="Search Community Boating"
									aria-describedby="pop-search-button" />
								<div className="input-group-append">
									<button id="pop-search-button" className="btn btn-outline-primary site-search-button"
										type="button">Search</button>
								</div>
							</div>
						</div>
					</form>
				</div>
			</div>
			<script type='text/javascript'
				src='http://cbi.flywheelsites.com/wp-content/themes/custom/assets/js/custom.js?ver=1590961919'></script>
			<script type='text/javascript'
				src='http://cbi.flywheelsites.com/wp-includes/js/wp-embed.min.js?ver=5.4.1'></script>
			<script type='text/javascript'
				src='http://cbi.flywheelsites.com/wp-content/plugins/gravityforms/js/jquery.json.min.js?ver=2.4.11'></script>
			<script type='text/javascript'>
			</script>
			<script type='text/javascript'
				src='http://cbi.flywheelsites.com/wp-content/plugins/gravityforms/js/gravityforms.min.js?ver=2.4.11'></script>
			<script type='text/javascript'
				src='http://cbi.flywheelsites.com/wp-content/plugins/gravityforms/js/placeholders.jquery.min.js?ver=2.4.11'></script>
			<script type='text/javascript'>
				{`
					document.addEventListener("DOMContentLoaded", function () {
						jQuery(document).bind('gform_post_render', function (event, formId, currentPage) {
							if (formId == 1) {
								if (typeof Placeholders != 'undefined') {
									Placeholders.enable();
								}
							}
						}); jQuery(document).bind('gform_post_conditional_logic', function (event, formId, fields, isInit) {});
			}, false);
					`}
			</script>
			<script type='text/javascript'>
				{`
					document.addEventListener("DOMContentLoaded", function () {jQuery(document).ready(function () { jQuery(document).trigger('gform_post_render', [1, 1]) }); }, false);
					`}
			</script>
			<script>
				{`
					(function (document, tag) { var script = document.createElement(tag); var element = document.getElementsByTagName('body')[0]; script.src = 'https://acsbap.com/apps/app/assets/js/acsb.js'; script.async = true; script.defer = true; (typeof element === 'undefined' ? document.getElementsByTagName('html')[0] : element).appendChild(script); script.onload = function () {acsbJS.init({ statementLink: '', feedbackLink: '', footerHtml: '', hideMobile: false, hideTrigger: false, language: 'en', position: 'right', leadColor: '#146FF8', triggerColor: '#146FF8', triggerRadius: '50%', triggerPositionX: 'right', triggerPositionY: 'bottom', triggerIcon: 'default', triggerSize: 'medium', triggerOffsetX: 20, triggerOffsetY: 20, mobile: { triggerSize: 'small', triggerPositionX: 'right', triggerPositionY: 'bottom', triggerOffsetX: 0, triggerOffsetY: 0, triggerRadius: '0' } }); }; }(document, 'script'));
					`}

			</script>
		</div>;
	}
}

export default class FactaBase extends React.Component {
	render() {
		return (<React.Fragment>
			<FactaHelmet>
				<FactaBody>
					{this.props.children}
				</FactaBody>
			</FactaHelmet>

		</React.Fragment>)
	}
}