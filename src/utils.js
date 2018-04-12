export const __DEV__ = process.env.NODE_ENV !== 'production';

/* global performance */
export const timer = (
  typeof performance !== 'undefined'
  && performance
  && performance.now
    ? performance : Date
);

export const isReactComponent = Component =>
  Boolean(Component
    && Component.prototype
    && typeof Component.prototype.render === 'function');

export const isReactComponentInstance = instance =>
  Boolean(instance
    && Object.getPrototypeOf(instance)
    && typeof Object.getPrototypeOf(instance).render === 'function');

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

// detect if the component is rendering from the client or the server
// copy from fbjs/lib/ExecutionEnvironment https://github.com/facebook/fbjs/blob/master/packages/fbjs/src/core/ExecutionEnvironment.js#L14-L18
export const canUseDOM = !!(
  typeof window !== 'undefined' &&
  window.document &&
  window.document.createElement
);
