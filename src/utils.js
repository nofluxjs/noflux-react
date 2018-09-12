export const __DEV__ = process.env.NODE_ENV !== 'production';

/* global performance */
export const timer = (
  typeof performance !== 'undefined'
  && performance
  && performance.now
    ? performance : Date
);

export const isReactComponent = Component => Boolean(Component
    && Component.prototype
    && typeof Component.prototype.render === 'function');

export const isReactComponentInstance = instance => Boolean(instance
    && typeof instance.render === 'function');

export const getComponentName = Component => {
  const constructor = Component.prototype && Component.prototype.constructor;
  return (
    Component.displayName
    || (constructor && constructor.displayName)
    || Component.name
    || (constructor && constructor.name)
    || 'Component'
  );
};

// detect if the component is rendering from the client or the server
// copy from fbjs/lib/ExecutionEnvironment
// https://github.com/facebook/fbjs/blob/38bf26f4e6ea64d7ff68393919fb5e98f5ceac3b/packages/fbjs/src/core/ExecutionEnvironment.js#L12-L16
export const canUseDOM = !!(
  typeof window !== 'undefined'
  && window.document
  && window.document.createElement
);

const hasSymbol = typeof Symbol === 'function' && Symbol.for;

export const SYMBOL_NOFLUX = hasSymbol ? Symbol.for('noflux') : '__noflux';
