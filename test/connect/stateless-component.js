import test from 'ava';
import React from 'react';
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
      text: React.PropTypes.string.isRequired,
    };
    connect(App);
  });
});
