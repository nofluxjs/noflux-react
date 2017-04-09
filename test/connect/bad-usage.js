import test from 'ava';
import React, { Component } from 'react';
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
      text: React.PropTypes.string.isRequired,
    };
    mount(<App text="hello, world" />);
  });
});
