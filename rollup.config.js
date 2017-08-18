import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import babel from 'rollup-plugin-babel';
import replace from 'rollup-plugin-replace';
import uglify from 'rollup-plugin-uglify';
import { version } from './package.json';

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
  plugins: [
    resolve(),
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
    target === 'umd' && replace({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
    }),
  ],
  dest: `dist/noflux-react.${target}.${isProd ? 'min.js' : 'js'}`,
};

if (isProd) {
  config.plugins.push(
    uglify({
      output: {
        comments: (node, comment) => comment.type === "comment2" && /@preserve|@license|@cc_on/i.test(comment.value),
      },
    })
  );
}

export default config;
