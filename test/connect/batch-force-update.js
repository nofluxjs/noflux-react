import test from 'ava';
import '../helpers/setup-test-env';
import React, { Component } from 'react';
import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { connect, state } from '../../src';

configure({ adapter: new Adapter() });

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
        <botton onClick={() => this.onClick()}>
          {state.get('name')}
        </botton>
      );
    }
  }

  const wrapper = mount(<App />);
  wrapper.find('botton').simulate('click');

  t.is(forceUpdateCallTimes, 1);
  t.is(renderCallTimes, 2);
  t.is(wrapper.find('botton').text(), 'Malash9');
});
