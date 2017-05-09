export const __DEV__ = process.env.NODE_ENV !== 'production';

export const SYMBOL_NOFLUX = '__noflux';

/* global performance */
export const timer = (
  typeof performance !== 'undefined'
  && performance
  && performance.now
  ? performance : Date
);

export const isReactComponent = Component =>
  Component && Component.prototype && Component.prototype.isReactComponent;

export const isReactPureComponent = Component =>
  Component && Component.prototype && Component.prototype.isPureReactComponent;

export const isReactStatelessComponent = Component =>
  typeof Component === 'function' && !isReactComponent(Component);

export const isReactComponentInstance = instance =>
  instance && Object.getPrototypeOf(instance) && Object.getPrototypeOf(instance).isReactComponent;

export const getComponentName = Component => {
  const constructor = Component.prototype && Component.prototype.constructor;
  return (
    Component.displayName
    || (constructor && constructor.displayName)
    || Component.name
    || (constructor && constructor.name)
    || 'NONAME'
  );
};

export const override = (Class, methodName, callback) => {
  Class.prototype[methodName] = callback(Class.prototype[methodName]);
};
