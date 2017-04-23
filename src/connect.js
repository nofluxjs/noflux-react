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
  if (Component.__noflux) {
    throw new SyntaxError(`You should not use @connect for component ${getComponentName(Component)} more than once, use @connect(path1, path2, ...) instead.`);
  }
  Component.__noflux = {};

  const cursors = cursorPaths.map(cursorPath => {
    if (!isString(cursorPath) && !Array.isArray(cursorPath)) {
      throw new TypeError('@connect(path1, path2, ...) every path must be String or Array.');
    }
    return state.cursor(cursorPath);
  });

  override(Component, 'componentDidMount', originComponentDidMount => function componentDidMount() {
    this.__noflux = {};
    const cursorChange = () => {
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
    };

    this.__noflux.cursorChangeHandlers = cursors.map(cursor => cursor.on('change', cursorChange));
    if (originComponentDidMount) {
      originComponentDidMount.call(this);
    }
  });

  override(Component, 'componentWillUnmount', originComponentWillUnmount => function componentWillUnmount() {
    this.__noflux.cursorChangeHandlers.forEach(handler => handler());
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

const connectWithCursor = cursorPaths => (target, prop, descriptor) => {
  if (!target) {
    throw new TypeError('connect(path1, path2, ...)() is invalid, the param component must be given.');
  }
  if (verifyReactImpureComponent(target, prop, descriptor)) {
    connectWrapper(target, cursorPaths);
  } else {
    throw new TypeError('@connect must be used for component.');
  }
};

const connect = (target, prop, descriptor) => {
  if (!target) {
    throw new TypeError('@connect() is invalid, do you mean @connect or @connect(\'\') or @connect([]) ?');
  }
  if (verifyReactImpureComponent(target, prop, descriptor)) {
    return connectWrapper(target);
  } else {
    const cursorPaths = Array.isArray(target) ? target : [target];
    return connectWithCursor(cursorPaths);
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
