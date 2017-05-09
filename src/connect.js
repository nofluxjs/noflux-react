import state from './state';
import {
  __DEV__,
  SYMBOL_NOFLUX,
  timer,
  isReactComponent,
  isReactPureComponent,
  isReactStatelessComponent,
  isReactComponentInstance,
  override,
  getComponentName,
} from './utils';

const connectComponent = Component => {
  if (Component[SYMBOL_NOFLUX]) {
    throw new SyntaxError(`You should not use @connect for component ${getComponentName(Component)} more than once.`);
  }
  Component[SYMBOL_NOFLUX] = {};

  override(Component, 'componentWillMount', originComponentWillMount => function componentWillMount() {
    // call origin componentWillMount
    if (originComponentWillMount) {
      originComponentWillMount.call(this);
    }

    // init
    this[SYMBOL_NOFLUX] = {
      getPaths: {},
      onChangeHandlers: [],
    };
    const __noflux = this[SYMBOL_NOFLUX];
    const cursorChange = () => {
      // skip change emitted after unmounting component
      // TODO: test this guard
      if (!__noflux.mounted) return;

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
    __noflux.onGetHandler = state.on('get', ({ path }) => {
      if (__noflux.isRendering && !__noflux.getPaths[path]) {
        __noflux.getPaths[path] = true;
        // register cursor change handler
        __noflux.onChangeHandlers.push(state.cursor(path).on('change', cursorChange));
      }
    });
  });

  override(Component, 'render', originRender => function render() {
    if (!originRender) {
      throw new Error(`No render method found on the returned component instance of ${getComponentName(Component)}, you may have forgotten to define render.`);
    }

    const __noflux = this[SYMBOL_NOFLUX];
    __noflux.isRendering = true;
    const vdom = originRender.call(this);
    __noflux.isRendering = false;
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
    const __noflux = this[SYMBOL_NOFLUX];
    // unregister cursor change handlers
    __noflux.onChangeHandlers.forEach(handler => handler());

    // inregister on get handler
    __noflux.onGetHandler();

    // reset component mounted flag
    __noflux.mounted = false;

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
