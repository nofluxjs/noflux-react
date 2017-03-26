import semver from 'semver';
import pureRender from 'pure-render-decorator';

let reactVersion = null;
try {
  reactVersion = require('react/package.json').version;
} catch (e) {
  console.error(new ReferenceError('react not install'));
}
if (!reactVersion) {
  throw new ReferenceError('React not install');
}

if (semver.gte(reactVersion, '15.3.0')) {
  console.warn('@pure is deprecated, use React.PureComponent instead. https://facebook.github.io/react/docs/pure-render-mixin.html')
} else {
}
export default pureRender;