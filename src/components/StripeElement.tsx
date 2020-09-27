import * as React from 'react';
import { TokensResult } from '../models/stripe/tokens';
import FactaButton from '../theme/facta/FactaButton';

type Props = {
	formId: string, 		// "payment-form"
	elementId: string,		// "card-element"
	cardErrorsId: string,	// "card-errors"
	then: (result: TokensResult) => Promise<any>
}

declare var Stripe: any;

export default class StripeElement extends React.Component<Props> {
	submit: () => Promise<any>
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
			return (stripe.createToken(card) as Promise<any>).then(function(result: any) {
				if (result.error) {
					// Inform the customer that there was an error
					var errorElement = document.getElementById(self.props.cardErrorsId);
					errorElement.textContent = result.error.message;
					return Promise.resolve();
				} else {
					return self.props.then(result);
				}
			});
		}

		// Add an instance of the card Element into the `card-element` <div>
		if (document.getElementById(this.props.elementId)) {
			card.mount(`#${this.props.elementId}`);

			card.addEventListener('change', function(event: any) {
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
				<FactaButton text="Submit Card Details" spinnerOnClick onClick={() => this.submit()}/>
			</form>
		);
		return paymentForm;
	}
}