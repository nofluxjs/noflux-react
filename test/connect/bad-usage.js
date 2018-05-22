import test from 'ava';
import '../helpers/setup-test-env';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { mount } from 'enzyme';
import { connect } from '../../src';

test('can not use @connect for component method', t => {
  const error = t.throws(() => {
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
  t.is(error.message, '@connect should not be used for component method.');
});

test('can not use @connect()', t => {
  const error = t.throws(() => connect()(() => null));
  t.is(error.message, '@connect() is invalid, do you mean @connect ?');
});

test('can not use @connect for non-component value', t => {
  const errors = [
    t.throws(() => connect({})),
    t.throws(() => connect([])),
    t.throws(() => connect(1)),
    t.throws(() => connect('a')),
  ];
  for (const error of errors) {
    t.is(error.message, '@connect should be used for React component');
  }
});
