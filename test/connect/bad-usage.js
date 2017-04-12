import test from 'ava';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { mount } from 'enzyme';
import { connect } from '../../src';

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
