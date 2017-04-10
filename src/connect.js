import { Observable } from 'rxjs/Observable';
import { from } from 'rxjs/observable/from';
import { mergeMap } from 'rxjs/operator/mergeMap';
import { share } from 'rxjs/operator/share';
import state from './state';
import {
  __DEV__,
  timer,
  isString,
  isReactComponent,
  isReactPureComponent,
  isReactStatelessComponent,
  isReactComponentInstance,
  override,
  getComponentName,
} from './utils';

const connectWrapper = (Component, cursorPaths = ['']) => {
  cursorPaths.forEach(path => {
    if (!isString(path) && !Array.isArray(path)) {
      throw new TypeError('@connect(path1, path2, ...) every path must be String or Array.');
    }
  });
  if (Component.__noflux) {
    throw new SyntaxError(`You should not use @connect for component ${getComponentName(Component)} more than once, use @connect(path1, path2, ...) instead.`);
  }
  Component.__noflux = {};

  const change$ = Observable
    ::from(cursorPaths)
    ::mergeMap(path => state.cursor(path).listen('change'))
    ::share();

  override(Component, 'componentDidMount', originComponentDidMount => function componentDidMount() {
    this.__noflux = {};
    this.__noflux.subscription = change$
      .subscribe({
        next: () => {
          if (__DEV__) {
            this.__noflux.timers = {
              startUpdate: timer.now(),
            };
          }
          this.forceUpdate(() => {
            if (__DEV__) {
              this.__noflux.timers.endUpdate = timer.now();
              const cost = this.__noflux.timers.endUpdate - this.__noflux.timers.startUpdate;
              // eslint-disable-next-line no-console
              console.log(`[noflux] ${getComponentName(Component)} rendering time ${cost.toFixed(3)} ms`);
            }
          });
        },
      });
    if (originComponentDidMount) {
      originComponentDidMount.call(this);
    }
  });

  override(Component, 'componentWillUnmount', originComponentWillUnmount => function componentWillUnmount() {
    this.__noflux.subscription.unsubscribe();
    if (originComponentWillUnmount) {
      originComponentWillUnmount.call(this);
    }
  });

  return Component;
};

const verifyReactImpureComponent = (target, prop, descriptor) => {
  if (isReactComponentInstance(target) && prop && descriptor) {
    throw new SyntaxError('@connect should not be used for component method.');
  }
  if (isReactStatelessComponent(target)) {
    throw new TypeError('@connect should not be used for stateless component.');
  }
  if (isReactPureComponent(target)) {
    throw new TypeError('@connect should not be used for pure component.');
  }
  if (isReactComponent(target)) {
    return true;
  }
  return false;
};

const connectWithCursor = cursorPaths => (...args) => {
  const [target, prop, descriptor] = args;
  if (!target) {
    throw new TypeError('connect(path1, path2, ...)() is invalid, the param component must be given.');
  }
  if (verifyReactImpureComponent(target, prop, descriptor)) {
    connectWrapper(target, cursorPaths);
  } else {
    throw new TypeError('@connect must be used for component.');
  }
};

const connect = (...args) => {
  const [target, prop, descriptor] = args;
  if (!target) {
    throw new TypeError('@connect() is invalid, do you mean @connect or @connect(\'\') or @connect([]) ?');
  }
  if (verifyReactImpureComponent(target, prop, descriptor)) {
    return connectWrapper(target);
  } else {
    return connectWithCursor(args);
  }
};

let noticed = false;

export const Connect = (...args) => {
  if (!noticed) {
    noticed = true;
    // eslint-disable-next-line no-console
    console.warn('@Connect is deprecated, use @connect instead.');
  }
  return connect(...args);
};

export default connect;
