import test from 'ava';
import React, { Component } from 'react';
import { mount } from 'enzyme';
import { connect, state } from '../../src';

test('set on componentDidMount should re-render', t => {
  state.load({ name: 'Ssnau' });

  let renderCallTimes = 0;
  @connect
  class App extends Component {
    componentDidMount() {
      state.set('name', 'Malash');
    }
    render() {
      renderCallTimes++;
      return (
        <h1 id={state.get('name')}>
          {state.get('name')}
        </h1>
      );
    }
  }
  const wrapper = mount(<App />);
  t.is(wrapper.find('h1').props().id, 'Malash');
  t.is(wrapper.find('h1').text(), 'Malash');
  t.is(renderCallTimes, 2);
});
