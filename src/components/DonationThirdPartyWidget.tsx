import * as React from 'react';

// export const rawHTML = `
// <div style="border-left: 4px solid #2323d7;         padding: 10px 10px 10px 25px;     margin-left: 20px;     font-size: 1.1em;     background-color: #cbcbf7;">
// <b>Twenty-Twenty-One $100k Challenge</b>
// <br><br>
// In this very difficult time, we must be focused on the health and safety of all. Your tax-deductible gift to our Twenty-Twenty-One $100k Campaign will help us resume our programs as soon as possible and keep “Sailing for All” alive and strong for many years to come.<br><br>

// <script type="text/javascript" defer="" src="https://donorbox.org/install-popup-button.js"></script><a class="dbox-donation-button" style="background: #41a2d8 url(https://d1iczxrky3cnb2.cloudfront.net/red_logo.png) no-repeat 37px;color: #fff;text-decoration: none;font-family: Verdana,sans-serif;display: inline-block;font-size: 16px;padding: 15px 38px;padding-left: 75px;-webkit-border-radius: 2px;-moz-border-radius: 2px;border-radius: 2px;box-shadow: 0 1px 0 0 #1f5a89;text-shadow: 0 1px rgba(0, 0, 0, 0.3);" href="https://donorbox.org/twenty-twenty-one-100k-challenge">Donate</a></div>`

export class DonationThirdPartyWidget extends React.PureComponent {
	componentDidMount() {
		var tag = document.createElement('script');
		tag.async = false;
		tag.defer = true;
		tag.src = "https://donorbox.org/install-popup-button.js";
		var container = document.getElementById('donorbox-container');
		container.appendChild(tag);
	}
	render() {
		return <div id="donorbox-container" style={{
			borderLeft: "4px solid #2323d7",
			padding: "10px 10px 10px 25px",
			marginLeft: "20px",
			// fontSize: "1.1em",
			backgroundColor: "#cbcbf7"
		}}>
			<b>Twenty-Twenty-One $100k Challenge</b>
			<br />
			<br />
				In this very difficult time, we must be focused on the health and safety of all.
				Your tax-deductible gift to our Twenty-Twenty-One $100k Campaign will help us resume our programs as soon as possible
				and keep “Sailing for All” alive and strong for many years to come.
			<br/>
			<br/>
			<a className="dbox-donation-button" style={{
				background: "#41a2d8 url(https://d1iczxrky3cnb2.cloudfront.net/red_logo.png) no-repeat 37px",
				color: "#fff",
				textDecoration: "none",
				fontFamily: "Verdana,sans-serif",
				display: "inline-block",
				fontSize: "16px",
				padding: "15px 38px",
				paddingLeft: "75px",
				WebkitBorderRadius: "2px",
				MozBorderRadius: "2px",
				borderRadius: "2px",
				boxShadow: "0 1px 0 0 #1f5a89",
				textShadow: "0 1px rgba(0, 0, 0, 0.3)"
			}} href="https://donorbox.org/twenty-twenty-one-100k-challenge">Donate</a>
		</div>;
	}
}
	