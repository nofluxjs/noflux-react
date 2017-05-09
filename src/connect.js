import state from './state';
import {
  __DEV__,
  timer,
  isReactComponent,
  isReactPureComponent,
  isReactStatelessComponent,
  isReactComponentInstance,
  override,
  getComponentName,
} from './utils';

const connectComponent = Component => {
  if (Component.__noflux) {
    throw new SyntaxError(`You should not use @connect for component ${getComponentName(Component)} more than once.`);
  }
  Component.__noflux = {};

  override(Component, 'componentWillMount', originComponentWillMount => function componentWillMount() {
    // call origin componentWillMount
    if (originComponentWillMount) {
      originComponentWillMount.call(this);
    }

    // init
    this.__noflux = {
      getPaths: {},
      onChangeHandlers: [],
    };
    const cursorChange = () => {
      // skip change emitted after unmounting component
      // TODO: test this guard
      if (!this.__noflux.mounted) return;

      const startTime = timer.now();
      this.forceUpdate(() => {
        const endTime = timer.now();
        const cost = endTime - startTime;
        if (__DEV__) {
          // eslint-disable-next-line no-console
          console.log(`[noflux] ${getComponentName(Component)} rendering time ${cost.toFixed(3)} ms`);
        }
      });
    };
    this.__noflux.onGetHandler = state.on('get', ({ path }) => {
      if (this.__noflux.isRendering && !this.__noflux.getPaths[path]) {
        this.__noflux.getPaths[path] = true;
        // register cursor change handler
        this.__noflux.onChangeHandlers.push(state.cursor(path).on('change', cursorChange));
      }
    });
  });

  override(Component, 'render', originRender => function render() {
    if (!originRender) {
      throw new Error(`No render method found on the returned component instance of ${getComponentName(Component)}, you may have forgotten to define render.`);
    }

    this.__noflux.isRendering = true;
    const vdom = originRender.call(this);
    this.__noflux.isRendering = false;
    return vdom;
  });

  override(Component, 'componentDidMount', originComponentDidMount => function componentDidMount() {
    // call origin componentDidMount
    if (originComponentDidMount) {
      originComponentDidMount.call(this);
    }

    // set component mounted flag
    this.__noflux.mounted = true;
  });

  override(Component, 'componentWillUnmount', originComponentWillUnmount => function componentWillUnmount() {
    // unregister cursor change handlers
    this.__noflux.onChangeHandlers.forEach(handler => handler());

    // inregister on get handler
    this.__noflux.onGetHandler();

    // reset component mounted flag
    this.__noflux.mounted = false;

    // call origin componentWillUnmount
    if (originComponentWillUnmount) {
      originComponentWillUnmount.call(this);
    }
  });

  return Component;
};

const connect = (target, prop, descriptor) => {
  if (!target) {
    throw new TypeError('@connect() is invalid, do you mean @connect or @connect(\'\') or @connect([]) ?');
  }
  if (isReactComponentInstance(target) && prop && descriptor) {
    throw new SyntaxError('@connect should not be used for component method.');
  }
  if (isReactStatelessComponent(target)) {
    throw new TypeError('@connect should not be used for stateless component.');
  }
  if (isReactPureComponent(target)) {
    throw new TypeError('@connect should not be used for pure component.');
  }
  if (!isReactComponent(target)) {
    throw new TypeError('@connect should be used for React component');
  }
  return connectComponent(target);
};

let noticed = false;
export const Connect = (...args) => {
  if (!noticed) {
    noticed = true;
    // eslint-disable-next-line no-console
    console.warn('Warning: @Connect is deprecated, use @connect instead.');
  }
  return connect(...args);
};

export default connect;
