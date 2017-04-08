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
  override,
  getComponentName,
} from './utils';

let middlewares = [];

export const applyMiddleware = (...newMiddlewares) => {
  middlewares = [...([...newMiddlewares].reverse()), ...middlewares];
};

const connectWrapper = (Component, pathArray = ['']) => {
  for (let i = 0; i < pathArray.length; i++) {
    const path = pathArray[i];
    if (!isString(path) && !Array.isArray(path)) {
      throw new TypeError('@connect(path1, path2, ...) every path must be String or Array');
    }
  }
  if (Component.__noflux) {
    throw new SyntaxError(`You should not use @connect for component ${getComponentName(Component)} more than once, use @connect(path1, path2, ...) instead`);
  }
  Component.__noflux = {};

  const change$ = Observable
    ::from(pathArray)
    ::mergeMap(path => state.cursor(path).listen('change'))
    ::share();

  override(Component, 'componentDidMount', originComponentDidMount => function componentDidMount() {
    this.__noflux = {
      lastStateValue: state.get(),
    };
    this.__noflux.subscription = change$
      .subscribe({
        next: value => {
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
              middlewares.forEach(middleware =>
                middleware({
                  dispatch: () => {},
                  getState: () => this.__noflux.lastStateValue,
                })(() => {
                  this.__noflux.lastStateValue = state.get();
                })(
                  { type: 'change', value },
                ),
              );
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

const connect = (...args) => {
  if (!args.length) {
    throw new TypeError('@connect() is invalid, do you mean @connect or @connect(\'\') or @connect([]) ?');
  }
  const [Component] = args;
  if (isReactPureComponent(Component)) {
    throw new TypeError('@connect should not be used for PureComponent');
  } else if (isReactComponent(Component)) {
    return connectWrapper(Component);
  } else {
    return realComponent => connectWrapper(realComponent, args);
  }
};

export default connect;
