import test from 'ava';
import '../helpers/setup-test-env';
import React, { Component } from 'react';
import { mount } from 'enzyme';
import { connect, state } from '../../src';

test('should batch forceUpdate', t => {
  state.set({ name: 'Ssnau' });

  let forceUpdateCallTimes = 0;
  let renderCallTimes = 0;

  @connect
  class App extends Component {
    onClick() {
      for (let i = 0; i < 10; i++) {
        state.set('name', `Malash${i}`);
      }
    }

    forceUpdate(...args) {
      super.forceUpdate(...args);
      forceUpdateCallTimes++;
    }

    render() {
      renderCallTimes++;
      return (
        <button onClick={() => this.onClick()}>
          {state.get('name')}
        </button>
      );
    }
  }

  const wrapper = mount(<App />);
  wrapper.find('button').simulate('click');

  t.is(forceUpdateCallTimes, 1);
  t.is(renderCallTimes, 2);
  t.is(wrapper.find('button').text(), 'Malash9');
});
