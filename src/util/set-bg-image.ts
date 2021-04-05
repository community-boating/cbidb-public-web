export function setCheckoutImage() {
	const bgImageNode = document.getElementById('hero');
	if (bgImageNode) {
		bgImageNode.style.background = 'url(/facta/assets/images/common-hero.jpg)';
		bgImageNode.style.backgroundPositionY = "-730px";
	}

	const heroTextNode = document.getElementById('hero-text');
	if (heroTextNode) heroTextNode.innerText = "CBI Membership Portal"
}

export function setJPImage() {
	const bgImageNode = document.getElementById('hero');
	if (bgImageNode) {
		bgImageNode.style.background = 'url(/facta/assets/images/jp-hero.jpeg)';
		bgImageNode.style.backgroundPositionY = "-550px";
	}

	const heroTextNode = document.getElementById('hero-text');
	if (heroTextNode) heroTextNode.innerText = "Junior Program Membership Portal"
}

export function setAPImage() {
	const bgImageNode = document.getElementById('hero');
	if (bgImageNode) {
		bgImageNode.style.background = 'url(/facta/assets/images/ap-hero.jpeg)';
		bgImageNode.style.backgroundPositionY = "-550px";
	}

	const heroTextNode = document.getElementById('hero-text');
	if (heroTextNode) heroTextNode.innerText = "Adult Program Membership Portal"
}

