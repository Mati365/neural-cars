const path = require('path');

module.exports = {
  parser: 'babel-eslint',
  'extends': 'airbnb',
  parserOptions: {
    ecmaVersion: 6,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true
    }
  },
  env: {
    browser: true
  },
  rules: {
    'nonblock-statement-body-position': 0,
    'jsx-quotes': [
      'error',
      'prefer-single'
    ],
    'object-curly-spacing': [
      'error',
      'never'
    ],
    'jsx-a11y/click-events-have-key-events': 0,
    'jsx-a11y/mouse-events-have-key-events': 0,
    'no-plusplus': 0,
    'no-console': 0,
    'no-underscore-dangle': 0,
    'react/prop-types': 0,
    curly: 0,
    'new-parens': 0
  },
  settings: {
    'import/resolver': {
      node: {
        moduleDirectory: [
          'node_modules',
          'src'
        ]
      },
      webpack: {
        config: path.resolve('config/webpack.config.js'),
      }
    }
  }
}
