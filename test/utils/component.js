import test from 'ava';
import React, { Component } from 'react';
import { isReactComponent, isReactPureComponent, getComponentName } from '../../src/utils';

test('is react component', t => {
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
  t.falsy(isReactPureComponent(App));
  t.is(getComponentName(App), 'App');
});
