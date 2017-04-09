import test from 'ava';
import React, { Component } from 'react';
import { mount } from 'enzyme';
import { connect, state } from '../../src';

test('make the component fluxify', t => {
  state.set({ name: 'Ssnau' });

  @connect
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
  t.is(wrapper.find('h1').props().id, 'Malash');
  t.is(wrapper.find('h1').text(), 'Malash');
});
