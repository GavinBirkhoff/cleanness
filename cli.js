#!/usr/bin/env node

const yParser = require('yargs-parser')
const semver = require('semver')
const envinfo = require('envinfo')
const inquirer = require('inquirer')
const { existsSync } = require('fs')
const { join } = require('path')
const chalk = require('chalk')

// print version and @local
const args = yParser(process.argv.slice(2))

console.log(args)

if (args.v || args.version) {
  // eslint-disable-next-line global-require
  console.log(require('./package').version)
  if (existsSync(join(__dirname, '.local'))) {
    console.log(chalk.cyan('@local'))
  }
  process.exit(0)
}

if (!semver.satisfies(process.version, '>= 8.0.0')) {
  console.error(chalk.red('✘ The generator will only work with Node v8.0.0 and up!'))
  process.exit(1)
}
const cwd = process.cwd()

const option = args._[0]

switch (option) {
  case 'verify-commit':
    // eslint-disable-next-line global-require
    require('./dist/verifyCommit')
    break
  case 'init':
    inquirer
      .prompt([
        {
          type: 'list',
          message: '请选择一个选项：',
          name: 'cleannessChose',
          default: 'recommend',
          prefix: '☆☆☆☆',
          suffix: '****',
          choices: ['recommend', 'customize'],
        },
      ])
      .then(({ cleannessChose }) => {
        if (cleannessChose === 'customize') {
          inquirer
            .prompt([
              {
                type: 'checkbox',
                message: 'Choose one or more formats',
                name: 'formats',
                choices: ['prettier', 'eslint', 'stylelint'],
              },
            ])
            .then(({ formats }) => {
              console.log(formats)
            })
        } else {
          console.log(cleannessChose)
        }
      })

    break
  case 'info':
    envinfo
      .run(
        {
          System: ['OS', 'CPU'],
          Binaries: ['Node', 'Yarn', 'npm'],
          Browsers: ['Chrome', 'Firefox', 'Safari'],
          npmPackages: ['styled-components', 'babel-plugin-styled-components'],
        },
        { json: true, showNotFound: true },
      )
      .then(env => console.log(env))
    break
  default:
    if (args.h || args.help) {
      const details = `
      Commands:
        ${chalk.cyan('verify-commit')}    检查 commit 提交的信息
      Examples:
        ${chalk.gray('cleanness')}
        cleanness -h
        ${chalk.gray('verify-commit ')}
        cleanness verify-commit
        `.trim()
      console.log(details)
    }
    break
}
