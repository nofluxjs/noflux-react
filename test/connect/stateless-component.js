import test from 'ava';
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from '../../src';

test('can not use @connect for stateless component', t => {
  t.throws(() => {
    function App(props) {
      return (
        <h1>
          {props.text}
        </h1>
      );
    }
    App.propTypes = {
      text: PropTypes.string.isRequired,
    };
    connect(App);
  });
});
