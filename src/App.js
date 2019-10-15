import React from 'react';
import './App.css';
import { Container } from 'react-bootstrap';
import InterestCalculator from './components/InterestCalculator';

class App extends React.Component {

  render () {
    return (
      <Container>

        {/* Display interest calculator component */}
        <InterestCalculator />
      </Container>
    );
  }
}

export default App;