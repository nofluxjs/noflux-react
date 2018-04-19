import state from './state';
import {
  __DEV__,
  timer,
  isReactComponent,
  isReactComponentInstance,
  override,
  getComponentName,
  canUseDOM,
} from './utils';

const SYMBOL_NOFLUX = '__noflux';

const connectComponent = Component => {
  if (Component[SYMBOL_NOFLUX]) {
    throw new SyntaxError(`You should not use @connect for component ${getComponentName(Component)} more than once.`);
  }
  Component[SYMBOL_NOFLUX] = {};

  // skip event listening for server-side rendering
  if (!canUseDOM) {
    return Component;
  }

  override(Component, 'render', originRender => function render() {
    if (!originRender) {
      throw new Error(`No render method found on the returned component instance of ${getComponentName(Component)}, you may have forgotten to define render.`);
    }

    let __noflux = this[SYMBOL_NOFLUX];
    if (!__noflux) {
      // init
      this[SYMBOL_NOFLUX] = {
        getPaths: {},
        onChangeDisposers: [],
        mounted: false,
        isForcingUpdate: false,
      };
      __noflux = this[SYMBOL_NOFLUX];

      const cursorChange = () => {
        // skip change emitted after unmounting component
        // TODO: test this guard
        if (!__noflux.mounted) return;

        // skip duplicate forceUpdate calling
        if (__noflux.isForcingUpdate) return;
        __noflux.isForcingUpdate = true;

        const startTime = timer.now();
        this.forceUpdate(() => {
          __noflux.isForcingUpdate = false;

          const endTime = timer.now();
          const cost = endTime - startTime;
          if (__DEV__) {
            // eslint-disable-next-line no-console
            console.log(`[noflux] ${getComponentName(Component)} rendering time ${cost.toFixed(3)} ms`);
          }
        });
      };
      __noflux.onGetDisposer = state.on('get', ({ path }) => {
        if (__noflux.isRendering && !__noflux.getPaths[path]) {
          __noflux.getPaths[path] = true;
          // register cursor change handler
          __noflux.onChangeDisposers.push(state.cursor(path).on('change', cursorChange));
        }
      });
    }

    __noflux.isRendering = true;
    const vdom = originRender.call(this);
    __noflux.isRendering = false;
    return vdom;
  });

  override(Component, 'componentDidMount', originComponentDidMount => function componentDidMount() {
    // set component mounted flag
    this[SYMBOL_NOFLUX].mounted = true;

    // call origin componentDidMount
    if (originComponentDidMount) {
      originComponentDidMount.call(this);
    }
  });

  override(Component, 'componentWillUnmount', originComponentWillUnmount => function componentWillUnmount() {
    const __noflux = this[SYMBOL_NOFLUX];
    // dispose cursor change listeners
    __noflux.onChangeDisposers.forEach(disposer => disposer());

    // dispose get listener
    __noflux.onGetDisposer();

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
    throw new TypeError('@connect() is invalid, do you mean @connect ?');
  }
  if (isReactComponentInstance(target) && prop && descriptor) {
    throw new SyntaxError('@connect should not be used for component method.');
  }
  if (!isReactComponent(target)) {
    throw new TypeError('@connect should be used for React component');
  }
  return connectComponent(target);
};

export default connect;
