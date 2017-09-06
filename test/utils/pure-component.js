import test from 'ava';
import '../helpers/setup-test-env';
import React, { PureComponent } from 'react';
import { isReactComponent, isReactPureComponent, getComponentName } from '../../src/utils';

test('check pure component', t => {
  class App extends PureComponent {
    render() {
      return (
        <h1>
          hello, world
        </h1>
      );
    }
  }
  t.truthy(isReactComponent(App));
  t.truthy(isReactPureComponent(App));
  t.is(getComponentName(App), 'App');
});
