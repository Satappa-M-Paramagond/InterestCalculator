import React from 'react';
import './InterestCalculator.css';
import { Container, Row, Col, Form, Button, InputGroup } from 'react-bootstrap';

class InterestCalculator extends React.Component {

	constructor (props) {
		super(props);
		this.state = { loanValues : { amount : '', numMonths : ''}, data : { status : false }, isLoading : false };
		this._handleChange = this._handleChange.bind(this);
		this._handleSubmit = this._handleSubmit.bind(this);
		this._handleClear = this._handleClear.bind(this);
		this._handleReCalculate = this._handleReCalculate.bind(this);
		this._handleClearHistory = this._handleClearHistory.bind(this);
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

			// Get the existing values from local storage
			let storedData = JSON.parse(localStorage.getItem('loanData'));

			// Push news values to array
			const loanData = { amount : amount, numMonths : numMonths };

			if(storedData && storedData !== '')
			{
				storedData.push(loanData);
			}
			else
			{
				storedData = new Array(loanData);
			}

			// Store the news values to local storage
			localStorage.setItem('loanData', JSON.stringify(storedData));

			// Set the response to state
			this.setState({ data : response, isLoading : false });

			// Clear inputs after displaying results
			this.setState({ loanValues : { amount : '', numMonths : ''}});
		});
	}

	// Clear the user inputs
	_handleClear = () => {
		this.setState({ loanValues : { amount : '', numMonths : ''} });
	}

	// Recalculate the recent
	_handleReCalculate = (amount, numMonths) => {

		// Set the current values in states
		let loanValues = { amount : amount, numMonths : numMonths };
		this.setState({ loanValues : loanValues });

		// Trigger the submit button
		setTimeout( function () { document.getElementById('submit_btn').click(); }, 500);
	}

	// Clear all history from local storage
	_handleClearHistory = () => {
		localStorage.clear();

		// Update render after clearing local storage
		this.forceUpdate();
	}
	
	render () {

		const { loanValues, data, isLoading} = this.state;

		// Get the values from local storge to display at history
		const loanData = JSON.parse(localStorage.getItem('loanData'));

		return (
			<Container className="loan_container pt-3">
				<Row>
					<Col xl={8} lg={8} md={8} sm={8} xs={12} className="user_form p-4 mt-2">

						<h1 className="text-info text-center"> Interest calculator</h1>
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
							
							{/* Submit button to calculate interest and monthly payment and reset button to clear all inputs and sliders */}
							<Form.Group className="text-right">
								<Button type="button" variant="danger" className="btn-lg" onClick={this._handleClear}>Clear</Button>
								<Button type="submit" id="submit_btn" variant="info" className="btn-lg ml-3">{ isLoading ? 'Calculating...' : 'Calculate' }</Button>
							</Form.Group>
						</Form>

						{/* Results display */}
						{
							data && data.status ? 
								<Col>
									<hr />
									<h2 className="my-4 text-info"> Results :</h2>
									<h5 className="text-blue">Interest rate : {data.interestRate}</h5>
									<h5 className="text-blue">Monthly payment : {data.monthlyPayment.currency} {data.monthlyPayment.amount}</h5>
									<h5 className="text-blue">Number of payments : {data.numPayments}</h5>
									<h5 className="text-blue">Principal payment : {data.principal.currency} {data.principal.amount}</h5>
								</Col>
							: ''
						}

					</Col>

					{/* Recently calculated user inputs history */}
					<Col className="mt-2">
						<div className="history_container p-4">
							<h4 className="text-info text-center"> History </h4>
							{
								loanData && loanData.length > 0 ? 
									loanData.map(data => (
										<div className="mt-4">
											<h6 className="text-blue"> Amount : {data.amount}</h6>
											<h6 className="text-blue"> Duration : {data.numMonths}</h6>
											<Button type="button" variant="info" className="btn-sm mt-2" onClick={() => this._handleReCalculate(data.amount, data.numMonths)}>Recalculate</Button>
											<hr />
										</div>
									))
								: 
									<h6 className="text-blue text-center mt-5"> No history found.</h6>
							}

							{
								loanData && loanData.length > 0 ? 
									<div className="text-center mt-4">
										<Button type="button" variant="danger" className="btn-sm" onClick={this._handleClearHistory}>Clear all</Button>
									</div>
								: <div></div>
							}
							
						</div>
					</Col>

				</Row>
			</Container>
		)
	}

}

export default InterestCalculator;
