import * as React from 'react';
import { TokensResult } from '../models/stripe/tokens';
import Button from './Button';

type Props = {
	formId: string, 		// "payment-form"
	elementId: string,		// "card-element"
	cardErrorsId: string,	// "card-errors"
	then: (result: TokensResult) => any
}

declare var Stripe;



export default class StripeElement extends React.Component<Props> {
	submit: () => void
	componentDidMount() {
		const self = this;
		// TODO: put this somewhere
		var stripe = Stripe((process.env.config as any).stripeKey);
		var elements = stripe.elements();
		// Custom styling can be passed to options when creating an Element.
		var style = {
			base: {
				// Add your base input styles here. For example:
				fontSize: '16px',
				color: "#32325d",
			}
		};

		// Create an instance of the card Element
		var card = elements.create('card', {
			style: style
		});

		this.submit = () => {
			stripe.createToken(card).then(function(result) {
				if (result.error) {
					// Inform the customer that there was an error
					var errorElement = document.getElementById(self.props.cardErrorsId);
					errorElement.textContent = result.error.message;
				} else {
					self.props.then(result)
				}
			});
		}

		// Add an instance of the card Element into the `card-element` <div>
		if (document.getElementById(this.props.elementId)) {
			card.mount(`#${this.props.elementId}`);

			card.addEventListener('change', function(event) {
				var displayError = document.getElementById(self.props.cardErrorsId);
				if (event.error) {
					displayError.textContent = event.error.message;
				} else {
					displayError.textContent = '';
				}
			});

			var form = document.getElementById(self.props.formId);
			form.addEventListener('submit', function(event) {
				event.preventDefault();
				self.submit()
			});
		}
	}
	render() {
		const paymentForm = (
			<form action="/charge" method="post" id={this.props.formId}>
				<div className="form-row" style={{border: "1px solid #777", padding: "10px"}}>
					<label htmlFor="card-element">
						Credit or debit card
					</label>
					<div id={this.props.elementId}></div>
					<div id={this.props.cardErrorsId} role="alert"></div>
				</div>
				<br />
				<Button text="Submit Card Details" onClick={() => Promise.resolve(this.submit())}/>
			</form>
		);
		return paymentForm;
	}
}