/* eslint-env node, es2018 */
module.exports = {
  cjsBabelEnv: { targets: { node: 16 } },
  esmBabelEnv: { targets: { node: 16 } },
  // outputEsm: false, // disables ESM output (default: true)
  // esWrapper: true, // outputs ES module wrappers for CJS modules (default: false)
  scripts: {
    'update:examples': {
      description: 'update example expressions in the README',
      run: async () => {
        require('@jcoreio/toolchain-esnext/util/babelRegister.cjs')
        await require('./scripts/updateExamples').updateExamples()
      },
    },
  },
}
