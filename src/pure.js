import semver from 'semver';
import pureRender from 'pure-render-decorator';

const checkReactVersion = () => {
  let reactVersion;
  try {
    // eslint-disable-next-line global-require, import/no-unresolved
    reactVersion = require('react/package.json').version;
  } catch (e) {
    throw new ReferenceError('React not installed');
  }
  return reactVersion;
};

const checkPureDeprecated = () => {
  const reactVersion = checkReactVersion();
  return semver.gte(reactVersion, '15.3.0');
};

let noticed = false;

export default component => {
  if (!noticed) {
    noticed = true;
    const pureDeprecated = checkPureDeprecated();
    if (pureDeprecated) {
      // eslint-disable-next-line no-console
      console.warn('@pure is deprecated, use React.PureComponent instead. https://facebook.github.io/react/docs/pure-render-mixin.html');
    }
  }
  return pureRender(component);
};
