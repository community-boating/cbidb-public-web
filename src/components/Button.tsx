import * as React from "react";

interface Props {
	text: React.ReactNode,
	onClick: (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => Promise<any>,
	spinnerOnClick?: boolean,
	notIdempotent?: boolean, // set to true for non-idempotence, otherwise assume idempotent
	forceSpinner?: boolean
}

interface State {
	clicked: boolean
}

export default class Button extends React.PureComponent<Props, State> {
	constructor(props: Props) {
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
	render() {
		const self = this;
		const maybeSpinner = this.props.forceSpinner || (this.state.clicked && this.props.spinnerOnClick) ? <span>&nbsp;&nbsp;<img height="14px" src="/images/spinner-white.gif" /></span> : "";
		return (<a className="readon" style={{ margin: "0 5px" }} onClick={e => {
			const didWork = self.setClicked();
			if (didWork || self.props.notIdempotent) {
				// Whatever happens on this click, after its done, attempt to reset the button which may or may not still exist
				self.props.onClick(e)
				.catch(err => {
					console.error("Uncaught promise reject in button onClick: ", err);
				})
				.then(self.reset.bind(self));
			}
		}}>
			<span>{this.props.text}{maybeSpinner}</span>
		</a>);
	}
}
