import test from 'ava';
import React, { Component } from 'react';
import {
  isReactComponent,
  isReactPureComponent,
  isReactStatelessComponent,
  isReactComponentInstance,
} from '../../src/utils';

test('check component instance', t => {
  class App extends Component {
    render() {
      return (
        <h1>
          hello, world
        </h1>
      );
    }
  }
  const instance = new App();
  t.falsy(isReactComponent(instance));
  t.falsy(isReactPureComponent(instance));
  t.falsy(isReactStatelessComponent(instance));
  t.truthy(isReactComponentInstance(instance));
});
