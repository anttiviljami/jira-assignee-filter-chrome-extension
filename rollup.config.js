const resolve = require('@rollup/plugin-node-resolve');
const commonjs = require('@rollup/plugin-commonjs');
const babel = require('rollup-plugin-babel');
const json = require('@rollup/plugin-json');
const copy = require('rollup-plugin-copy');

module.exports.default = [
  {
    input: 'src/index.js',
    output: {
      file: 'dist/bundle.js',
      format: 'umd',
      sourcemap: true,
    },
    plugins: [
      resolve(),
      json(),
      babel({
        exclude: 'node_modules/**',
        plugins: [['@babel/plugin-transform-react-jsx', { pragma: 'h' }]],
      }),
      commonjs(),
      copy({
        targets: [
          { src: 'src/style.css', dest: 'dist' },
        ],
      }),
    ],
  },
];
