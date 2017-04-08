export const __DEV__ = process.env.NODE_ENV !== 'production';

/* global performance */
export const timer = (
  typeof performance !== 'undefined'
  && performance
  && performance.now
  ? performance : Date
);

export const isString = str => typeof str === 'string';

export const isReactComponent = Component =>
  Component.prototype && Component.prototype.isReactComponent;

export const isReactPureComponent = Component =>
  Component.prototype && Component.prototype.isPureReactComponent;

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

export function noop() {}

export const override = (Class, methodName, callback) => {
  Class.prototype[methodName] = callback(Class.prototype[methodName]);
};
