import test from 'ava';
import '../helpers/setup-test-env';
import React, { Component } from 'react';
import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { Connect, state } from '../../src';

configure({ adapter: new Adapter() });

test('@Connect deprecated', t => {
  state.set({ name: 'Ssnau' });

  @Connect
  class App extends Component {
    render() {
      return (
        <h1 id={state.get('name')}>
          {state.get('name')}
        </h1>
      );
    }
  }
  const wrapper = mount(<App />);
  t.is(wrapper.find('h1').props().id, 'Ssnau');
  t.is(wrapper.find('h1').text(), 'Ssnau');

  state.set({ name: 'Malash' });
  wrapper.update();

  t.is(wrapper.find('h1').props().id, 'Malash');
  t.is(wrapper.find('h1').text(), 'Malash');
});
