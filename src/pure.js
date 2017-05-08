import pureRender from 'pure-render-decorator';

const checkPureDeprecated = () => {
  try {
    // eslint-disable-next-line global-require, import/no-unresolved
    const React = require('react');
    return Boolean(React.PureComponent);
  } catch (e) {
    throw new ReferenceError('React not installed');
  }
};

let noticed = false;
const pure = component => {
  if (!noticed) {
    noticed = true;
    const pureDeprecated = checkPureDeprecated();
    if (pureDeprecated) {
      // eslint-disable-next-line no-console
      console.warn('Warning: @pure is deprecated, use React.PureComponent instead. https://facebook.github.io/react/docs/pure-render-mixin.html');
    }
  }
  return pureRender(component);
};

export default pure;
