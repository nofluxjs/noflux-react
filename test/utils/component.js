import test from 'ava';
import '../helpers/setup-test-env';
import React, { Component } from 'react';
import { isReactComponent, getComponentName } from '../../src/utils';

test('check component', t => {
  class App extends Component {
    render() {
      return (
        <h1>
          hello, world
        </h1>
      );
    }
  }
  t.truthy(isReactComponent(App));
  t.is(getComponentName(App), 'App');
});
