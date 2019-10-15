import React from 'react';
import './InterestCalculator.css';
import { Container, Row, Col, Form, Button, InputGroup } from 'react-bootstrap';

class InterestCalculator extends React.Component {

	constructor (props) {
		super(props);
		this.state = { loanValues : { amount : '', numMonths : ''}, data : { status : false }, isLoading : false };
		this._handleChange = this._handleChange.bind(this);
		this._handleSubmit = this._handleSubmit.bind(this);
		this._handleReCalculate = this._handleReCalculate.bind(this);
	}

	// On change input handler
	_handleChange = (e) => {
		const { name, value } = e.target;
		let loanValues = this.state.loanValues;
		loanValues[name] = value;
		this.setState({ loanValues : loanValues });
	}

	// Api to get calculated loan details
	_handleSubmit = (e) => {
		e.preventDefault();
		this.setState({ isLoading : true });

		// Get the values from states
		const { amount, numMonths } = this.state.loanValues;

		// Call api to calculate the load based on user inputs
		fetch('https://ftl-frontend-test.herokuapp.com/interest?amount=' + amount + '&numMonths=' + numMonths)
		.then(res => res.json())
		.then(response => {
			let data = response;
			data.status = true;

			// Set the response to state
			this.setState({ data : response, isLoading : false });

			// Store the values in local staorage
			localStorage.setItem('amount', amount);
			localStorage.setItem('numMonths', numMonths);

		});
	}

	// Recalculate the recent
	_handleReCalculate = () => {
		const amount = localStorage.getItem('amount');
		const numMonths = localStorage.getItem('numMonths');

		// Set the current values in states
		let loanValues = { amount : amount, numMonths : numMonths };
		this.setState({ loanValues : loanValues });

		// Trigger the submit button
		setTimeout( function () { document.getElementById('submit_btn').click(); }, 500);
		
	}
	
	render () {

		const { loanValues, data, isLoading} = this.state;

		return (
			<Container className="loan_container">
				<Row>
					<Col xl={8} lg={8} md={8} sm={8} xs={12} className="user_form p-4 mt-2">

						<h1 className="text-light text-center"> Interest calculator</h1>
						<br/>

						{/* User input form for user inputs */}
						<Form autoComplete="off" onSubmit={this._handleSubmit}>

							<Form.Group className="form_group">
								<Form.Label className="form_label">Enter loan amount * : </Form.Label>
								<InputGroup>

									{/* Slider to select loan amount by user */}
									<span className="slider_text">$500</span>
									<Form.Control type="range" name="amount" min={500} max={5000} steps={10} value={loanValues.amount} onChange={this._handleChange} placeholder="Enter loan amount *" required />
									<span className="slider_text">$5000</span>

									{/* User input to enter loan amount */}
									<InputGroup.Prepend>
										<InputGroup.Text>$</InputGroup.Text>	
									</InputGroup.Prepend>
									<Form.Control type="number" name="amount" min={500} max={5000} value={loanValues.amount} onChange={this._handleChange} placeholder="Enter loan amount *" required />
								</InputGroup>
							</Form.Group>

							<Form.Group className="form_group">
								<Form.Label className="form_label">Enter loan duration * : </Form.Label>
								<InputGroup>

									{/* Slider to select loan duration by user */}
									<span className="slider_text">6 months</span>
									<Form.Control type="range" name="numMonths" min={6} max={24} value={loanValues.numMonths} onChange={this._handleChange} placeholder="Entare loan duration *" required />
									<span className="slider_text">24 months</span>
									<Form.Control type="number" name="numMonths" min={6} max={24} value={loanValues.numMonths} onChange={this._handleChange} placeholder="Entare loan duration *" required />
									
									{/* User input to enter loan duration */}
									<InputGroup.Append>
										<InputGroup.Text>months</InputGroup.Text>	
									</InputGroup.Append>
								</InputGroup>
							</Form.Group>
							
							{/* Submit button to calculate interest and monthly payment */}
							<Form.Group>
								<Button type="submit" id="submit_btn" variant="info" disabled={isLoading}>{ isLoading ? 'Calculating . . .' : 'Calculate' }</Button>
							</Form.Group>
						</Form>

						{/* Results display */}
						{
							data && data.status ? 
								<Col>
									<h4 className="text-light">Interest rate : {data.interestRate}</h4>
									<h4 className="text-light">Monthly payment : {data.monthlyPayment.currency} {data.monthlyPayment.amount}</h4>
									<h4 className="text-light">Number of payments : {data.numPayments}</h4>
									<h4 className="text-light">Principal payment : {data.principal.currency} {data.principal.amount}</h4>
								</Col>
							: ''
						}

					</Col>

					{/* Recently calculated user inputs history */}
					<Col className="mt-2">
						<div className="history_container p-2">
							<h4 className="text-light text-center"> Recently calculated </h4>
							<br/>
							<h5 className="text-light"> Amount : {localStorage.getItem('amount')}</h5>
							<h5 className="text-light"> Duration : {localStorage.getItem('numMonths')}</h5>
							<br/>
							<Button type="button" variant="light" onClick={this._handleReCalculate}>Recalculate</Button>
						</div>
					</Col>

				</Row>
			</Container>
		)
	}

}

export default InterestCalculator;
