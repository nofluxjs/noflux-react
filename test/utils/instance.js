import test from 'ava';
import '../helpers/setup-test-env';
import React, { Component } from 'react';
import {
  isReactComponent,
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
  t.truthy(isReactComponentInstance(instance));
});
