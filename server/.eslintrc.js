module.exports = {
  extends: 'airbnb-base',
  env: {
    jest: true,
    node: true,
  },
  rules: {
    'max-len': [1, 120, { tabWidth: 2, ignoreComments: true }],
    'linebreak-style': 0,
  },
};
