import test from 'ava';
import '../helpers/setup-test-env';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { connect } from '../../src';

configure({ adapter: new Adapter() });

test('can not use @connect for pure component', t => {
  t.throws(() => {
    class App extends Component {
      @connect
      render() {
        return (
          <h1>
            {this.props.text}
          </h1>
        );
      }
    }
    App.propTypes = {
      text: PropTypes.string.isRequired,
    };
    mount(<App text="hello, world" />);
  });
});
