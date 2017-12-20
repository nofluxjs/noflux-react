import test from 'ava';
import '../helpers/setup-test-env';
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from '../../src';

test('can use @connect for pure component', t => {
  t.notThrows(() => {
    @connect
    class App extends PureComponent {
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
  });
});
