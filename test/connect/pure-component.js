import test from 'ava';
import '../helpers/setup-test-env';
import React, { PureComponent } from 'react';
import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { connect, state } from '../../src';

configure({ adapter: new Adapter() });

test('make the pure component fluxify', t => {
  state.set({ name: 'Ssnau' });

  let renderCallTimes = 0;
  @connect
  class App extends PureComponent {
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
  t.is(wrapper.find('h1').props().id, 'Ssnau');
  t.is(wrapper.find('h1').text(), 'Ssnau');
  t.is(renderCallTimes, 1);

  state.set({ name: 'Malash' });
  wrapper.update();

  t.is(wrapper.find('h1').props().id, 'Malash');
  t.is(wrapper.find('h1').text(), 'Malash');
  t.is(renderCallTimes, 2);
});
