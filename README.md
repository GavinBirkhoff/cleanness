# cleanness

A collection of configuration files containing prettier, eslint, stylelint, and cli. thank umi.

# Use

安装

```bash
npm i cleanness --save-dev
yarn add cleanness -D
```

Command to initialize related files

```
cleanness init
```

or Manually add related files

in `.eslintrc.js`

```js
module.exports = {
  extends: [require.resolve('cleanness/dist/eslint')],

  // in antd-design-pro
  globals: {
    ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION: true,
    REACT_APP_ENV: true, // in umi
    page: true,
  },

  rules: {
    // your rules
  },
}
```

in `.stylelintrc.js`

```js
module.exports = {
  extends: [require.resolve('cleanness/dist/stylelint')],
  rules: {
    // your rules
  },
}
```

in `.prettierrc.js`

```js
const cleanness = require('cleanness')

module.exports = {
  ...cleanness.prettier,
}
```

or Add a .cleanness.config.js to your root

```js
//.cleanness.config.js
module.exports = {
  // open cleanness verify
  strict: true,
  // User-defined verification rules
  verify:
    /^(((\ud83c[\udf00-\udfff])|(\ud83d[\udc00-\ude4f\ude80-\udeff])|[\u2600-\u2B55]) )?(revert: )?(feat|fix|docs|UI|refactor|perf|workflow|build|CI|typos|chore|tests|types|wip|release|dep|locale)(\(.+\))?: .{1,50}/,
  // call it when verify was failed
  verifyMsg: function (locale) {
    // locale
    // echo log
  },
}
```
