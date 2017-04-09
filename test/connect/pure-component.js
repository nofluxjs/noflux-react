import test from 'ava';
import React, { PureComponent } from 'react';
import { connect } from '../../src';

test('can not use @connect for pure component', t => {
  t.throws(() => {
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
      text: React.PropTypes.string.isRequired,
    };
  });
});
