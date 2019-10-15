import React from 'react';
import { shallow, render, mount } from 'enzyme';
import InterestCalculator from './InterestCalculator';

describe('InterestCalculator', () => {
  let props;
  let shallowInterestCalculator;
  let renderedInterestCalculator;
  let mountedInterestCalculator;

  const shallowTestComponent = () => {
    if (!shallowInterestCalculator) {
      shallowInterestCalculator = shallow(<InterestCalculator {...props} />);
    }
    return shallowInterestCalculator;
  };

  const renderTestComponent = () => {
    if (!renderedInterestCalculator) {
      renderedInterestCalculator = render(<InterestCalculator {...props} />);
    }
    return renderedInterestCalculator;
  };

  const mountTestComponent = () => {
    if (!mountedInterestCalculator) {
      mountedInterestCalculator = mount(<InterestCalculator {...props} />);
    }
    return mountedInterestCalculator;
  };  

  beforeEach(() => {
    props = {};
    shallowInterestCalculator = undefined;
    renderedInterestCalculator = undefined;
    mountedInterestCalculator = undefined;
  });

  // Shallow / unit tests begin here
 
  // Render / mount / integration tests begin here
  
});
