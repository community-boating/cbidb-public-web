export function setCheckoutImage() {
	const bgImageNode = document.getElementById('rt-bg-image');
	if (bgImageNode) bgImageNode.style.background = 'url(/joomsource/968c6c17-b88b-43e6-b545-0943a6cfb6b9.jpg)';

	const heroTextNode = document.getElementById('hero-text');
	if (heroTextNode) heroTextNode.innerText = "CBI Membership Portal"
}

export function setJPImage() {
	const bgImageNode = document.getElementById('rt-bg-image');
	if (bgImageNode) bgImageNode.style.background = 'url(/joomsource/jpback.jpg)';

	const heroTextNode = document.getElementById('hero-text');
	if (heroTextNode) heroTextNode.innerText = "Junior Program Membership Portal"
}

export function setAPImage() {
	const bgImageNode = document.getElementById('rt-bg-image');
	if (bgImageNode) bgImageNode.style.background = 'url(/joomsource/6aa30e3f-3c38-4d9e-ebba-c09df60d59f5.jpg)';

	const heroTextNode = document.getElementById('hero-text');
	if (heroTextNode) heroTextNode.innerText = "Adult Program Membership Portal"
}

