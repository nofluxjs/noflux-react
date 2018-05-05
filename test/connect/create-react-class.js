/* eslint-disable react/prefer-es6-class */
import test from 'ava';
import '../helpers/setup-test-env';
import React from 'react';
import createReactClass from 'create-react-class';
import { mount } from 'enzyme';
import { connect, state } from '../../src';

test('works with create-react-class', t => {
  state.set({ name: 'Ssnau' });

  let renderCallTimes = 0;
  const App = connect(createReactClass({
    render() {
      renderCallTimes++;
      return (
        <h1 id={state.get('name')}>
          {state.get('name')}
        </h1>
      );
    },
  }));
  const wrapper = mount(<App />);
  t.is(wrapper.find('h1').props().id, 'Ssnau');
  t.is(wrapper.find('h1').text(), 'Ssnau');
  t.is(renderCallTimes, 1);

  state.set({ name: 'Malash' });

  t.is(wrapper.find('h1').instance().getAttribute('id'), 'Malash');
  t.is(wrapper.find('h1').text(), 'Malash');
  t.is(renderCallTimes, 2);
});
