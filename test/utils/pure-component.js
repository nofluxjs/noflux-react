import test from 'ava';
import React, { PureComponent } from 'react';
import { isReactComponent, getComponentName } from '../../src/utils';

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
  t.is(getComponentName(App), 'App');
});
