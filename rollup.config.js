import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import babel from 'rollup-plugin-babel';
import replace from 'rollup-plugin-replace';
import uglify from 'rollup-plugin-uglify';
import { version, dependencies, devDependencies, peerDependencies } from './package.json';

const target = process.env.TARGET || 'es';
const env = process.env.NODE_ENV || 'development';
const isProd = env === 'production';
const banner =`/*
 * @license
 * @noflux/react v${version}
 * (c) 2017-${new Date().getFullYear()} Malash <i@malash.me>
 * Released under the MIT License.
 */`;

const config = {
  entry: 'src/index.js',
  format: target,
  moduleName: 'NofluxReact',
  banner,
  external: Object.keys(Object.assign({}, dependencies, devDependencies, peerDependencies)),
  plugins: [
    commonjs(),
    babel({
      babelrc: false,
      exclude: 'node_modules/**',
      // .babelrc
      presets: [
        ['es2015', { modules: false }],
        'stage-0'
      ],
      plugins: ['external-helpers'],
    }),
  ],
  dest: `dist/noflux-react.${target}.${isProd ? 'min.js' : 'js'}`,
};

if (target === 'umd') {
  config.external = [];
  config.plugins = [].concat(
    [resolve()],
    config.plugins,
    [replace({ 'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV) })]
  );
}

if (isProd) {
  config.plugins = [].concat(
    config.plugins,
    [uglify({
      output: {
        comments: (node, comment) => comment.type === "comment2" && /@preserve|@license|@cc_on/i.test(comment.value),
      },
    })]
  );
}

export default config;
