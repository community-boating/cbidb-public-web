import * as React from 'react';

type Props = {
	formId: string, 		// "payment-form"
	elementId: string,		// "card-element"
	cardErrorsId: string	// "card-errors"
}

declare var Stripe;

export default class StripeElement extends React.Component<Props> {
	componentDidMount() {
		// TODO: put this somewhere
		var stripe = Stripe('pk_test_9lGKKlihnP3TT7oPu4TKV5Vh');
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


		// Add an instance of the card Element into the `card-element` <div>
		if (document.getElementById(this.props.elementId)) {
			card.mount(`#${this.props.elementId}`);

			card.addEventListener('change', function(event) {
				var displayError = document.getElementById(this.props.cardErrorsId);
				if (event.error) {
					displayError.textContent = event.error.message;
				} else {
					displayError.textContent = '';
				}
			});

			var form = document.getElementById('payment-form');
			form.addEventListener('submit', function(event) {
				event.preventDefault();
				console.log(card)
				stripe.createToken(card).then(function(result) {
					if (result.error) {
						// Inform the customer that there was an error
						var errorElement = document.getElementById('card-errors');
						errorElement.textContent = result.error.message;
					} else {
						// Send the token to your server
						console.log(result.token)
						//stripeTokenHandler(result.token);
					}
				});
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
				<button>Submit Payment</button>
			</form>
		);
		return paymentForm;
	}
}