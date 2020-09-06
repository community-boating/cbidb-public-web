import * as React from "react";

export interface PropsForUser {
	text: React.ReactNode,
	onClick: (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => Promise<any>,
	spinnerOnClick?: boolean,
	notIdempotent?: boolean, // set to true for non-idempotence, otherwise assume idempotent
	forceSpinner?: boolean,
}

export interface PropsForSubclass extends PropsForUser {
	container: (onClickWrapper: (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => Promise<any>, children: JSX.Element) => JSX.Element
}

interface State {
	clicked: boolean
}

export default abstract class Button extends React.PureComponent<PropsForSubclass, State> {
	constructor(props: PropsForSubclass) {
		super(props);
		this.state = {
			clicked: false
		}
	};

	// This is a hack and an anti-pattern, but I'm doing it anyway
	// Buttons may or may not unmount themselves, if their click action effects a page transition
	// When the api request (which determines if we transition) comes back, we might need to reset the button's state
	// Not going to require button onClick() calls to remember to reset the button only if the api came back `dont-transition`
	// Just reset the button after the onClick() does all its shit and NOOP if the onClick() happened to unmount the button
	private amMounted: boolean
	componentWillMount() {
		this.amMounted = true;
	}
	componentWillUnmount() {
		this.amMounted = false;
	}

	// Return true if we started unclicked and became clicked, false if we were already clicked
	setClicked() {
		const startingUnclicked = !this.state.clicked;
		if (startingUnclicked) {
			this.setState({
				...this.state,
				clicked: true
			})
			return true;
		} else return false;
	}
	reset() {
		if (this.amMounted){
			this.setState({
				...this.state,
				clicked: false
			})
		}
	}
	buttonOnClick(e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) {
		console.log("click")
		const didWork = this.setClicked();
		if (didWork || this.props.notIdempotent) {
			// Whatever happens on this click, after its done, attempt to reset the button which may or may not still exist
			return this.props.onClick(e)
			.catch(err => {
				console.error("Uncaught promise reject in button onClick: ", err);
			})
			.then(this.reset.bind(this));
		} else {
			return Promise.resolve();
		}
	}
	render() {
		console.log("this.props.spinnerOnClick ", this.props.spinnerOnClick)
		console.log("this.state.clicked", this.state.clicked)
		const spinner = <img height="17px" style={{height: "17px", marginTop: "-3px", verticalAlign: "middle"}} src="/images/spinner-white.gif" />;
		const maybeSpinner = this.props.forceSpinner || (this.state.clicked && this.props.spinnerOnClick) ? <span>&nbsp;&nbsp;{spinner}</span> : "";
		return this.props.container(this.buttonOnClick.bind(this), <span>{this.props.text}{maybeSpinner}</span>);
	}
}
