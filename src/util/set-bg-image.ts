// import { apBasePath } from "app/paths/ap/_base";
// import { jpBasePath } from "app/paths/jp/_base";

export function setCheckoutImageForDonations() {
	return setCheckoutImage("CBI Donation Portal");
}

export function setMugarImage() {
	const bgImageNode = document.getElementById('hero');
	if (bgImageNode) {
		// bgImageNode.style.background = 'url(/facta/assets/images/mugar-hero.jpg)';
		bgImageNode.style.background = 'url(/facta/assets/images/mugar-donation-header2.jpg)';
		bgImageNode.style.backgroundPositionY = "0px";
		bgImageNode.style.backgroundPositionX = "0px";
	}
	setRatio(450)

	// const navLogo = document.getElementById('nav-logo');
	// if (navLogo) {
	// 	navLogo.setAttribute("href", "/")
	// }

	const heroTextNode = document.getElementById('hero-text');
	if (heroTextNode) heroTextNode.innerText = "Donation Portal: David Mugar Statue Fund";
}

export function setCheckoutImage(heroText?: string) {
	const bgImageNode = document.getElementById('hero');
	if (bgImageNode) {
		bgImageNode.style.background = 'url(/facta/assets/images/common-hero.jpg)';
		bgImageNode.style.backgroundPositionY = "-730px";
	}
	setRatio(330)

	// const navLogo = document.getElementById('nav-logo');
	// if (navLogo) {
	// 	navLogo.setAttribute("href", "/")
	// }

	const heroTextNode = document.getElementById('hero-text');
	if (heroTextNode) heroTextNode.innerText = heroText || "CBI Membership Portal";
}

export function setJPImage() {
	const bgImageNode = document.getElementById('hero');
	if (bgImageNode) {
		bgImageNode.style.background = 'url(/facta/assets/images/jp-hero.jpeg)';
		bgImageNode.style.backgroundPositionY = "-550px";
	}
	setRatio(330)

	// const navLogo = document.getElementById('nav-logo');
	// if (navLogo) {
	// 	navLogo.setAttribute("href", jpBasePath.getPathFromArgs({}))
	// }

	const heroTextNode = document.getElementById('hero-text');
	if (heroTextNode) heroTextNode.innerText = "Junior Program Membership Portal"
}

export function setAPImage() {
	const bgImageNode = document.getElementById('hero');
	if (bgImageNode) {
		bgImageNode.style.background = 'url(/facta/assets/images/ap-hero.jpeg)';
		bgImageNode.style.backgroundPositionY = "-550px";
	}
	setRatio(330)

	// const navLogo = document.getElementById('nav-logo');
	// if (navLogo) {
	// 	navLogo.setAttribute("href", apBasePath.getPathFromArgs({}))
	// }

	const heroTextNode = document.getElementById('hero-text');
	if (heroTextNode) heroTextNode.innerText = "Adult Program Membership Portal"
}


function setRatio(size: number) {
	const ratioNode = document.getElementById('hero-ratio');
	if (ratioNode) {
		ratioNode.style.paddingBottom = size+"px";
	}
}