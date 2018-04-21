import { Component } from 'react';
import state from './state';
import {
  __DEV__,
  timer,
  isReactComponent,
  isReactComponentInstance,
  getComponentName,
  canUseDOM,
} from './utils';

const SYMBOL_NOFLUX = '__noflux';

const connectComponent = Target => {
  if (Target[SYMBOL_NOFLUX]) {
    throw new SyntaxError(`You should not use @connect for component ${getComponentName(Target)} more than once.`);
  }
  Target[SYMBOL_NOFLUX] = {};

  // skip event listening for server-side rendering
  if (!canUseDOM) {
    return Target;
  }

  class ConnectedComponent extends Target {
    static displayName = `Connect(${getComponentName(Target)})`;

    constructor(props) {
      super(props);

      // init
      this[SYMBOL_NOFLUX] = {
        getPaths: {},
        onChangeDisposers: [],
        mounted: false,
        isForcingUpdate: false,
      };
      const __noflux = this[SYMBOL_NOFLUX];

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
            console.log(`[noflux] ${getComponentName(Target)} rendering time ${cost.toFixed(3)} ms`);
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

    componentDidMount() {
      // set component mounted flag
      this[SYMBOL_NOFLUX].mounted = true;

      // call origin componentDidMount
      if (super.componentDidMount) {
        super.componentDidMount();
      }
    }

    componentWillUnmount() {
      const __noflux = this[SYMBOL_NOFLUX];
      // dispose cursor change listeners
      __noflux.onChangeDisposers.forEach(disposer => disposer());

      // dispose get listener
      __noflux.onGetDisposer();

      // reset component mounted flag
      __noflux.mounted = false;

      // call origin componentWillUnmount
      if (super.componentWillUnmount) {
        super.componentWillUnmount.call(this);
      }
    }

    render() {
      if (!super.render) {
        throw new Error(`No render method found on the returned component instance of ${getComponentName(Target)}, you may have forgotten to define render.`);
      }

      const __noflux = this[SYMBOL_NOFLUX];
      __noflux.isRendering = true;
      const vdom = super.render();
      __noflux.isRendering = false;
      return vdom;
    }
  }
  return ConnectedComponent;
};

const connect = (target, prop, descriptor) => {
  if (!target) {
    throw new TypeError('@connect() is invalid, do you mean @connect ?');
  }
  if (isReactComponentInstance(target) && prop && descriptor) {
    throw new SyntaxError('@connect should not be used for component method.');
  }
  if (!isReactComponent(target)) {
    if (typeof target !== 'function') {
      throw new TypeError('@connect should be used for React component');
    }
    class ConnectedComponent extends Component {
      static displayName = `Connect(${getComponentName(target)})`;
      static contextTypes = target.contextTypes;
      static propTypes = target.propTypes;
      static defaultProps = target.defaultProps;
      render() {
        return target.call(this, this.props, this.context);
      }
    }
    return connectComponent(ConnectedComponent);
  }
  return connectComponent(target);
};

export default connect;
