#!/usr/bin/env node

const yParser = require('yargs-parser')
const semver = require('semver')
const envinfo = require('envinfo')
const inquirer = require('inquirer')
const { existsSync } = require('fs')
const fs = require('fs-extra')
const { join } = require('path')
const chalk = require('chalk')
const packageProject = require('./package')

// print version and @local
const args = yParser(process.argv.slice(2))

const cleanness = ['.eslintrc.js', '.prettierrc.js', '.stylelintrc.js', '.prettierignore']
if (args.v || args.version) {
  // eslint-disable-next-line global-require
  console.log(packageProject.version)
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
          message: 'Start your journey:',
          name: 'cleannessChose',
          default: 'recommend',
          prefix: '🏄‍♂️',
          suffix: '',
          choices: ['recommend', 'customize'],
        },
      ])
      .then(({ cleannessChose }) => {
        if (cleannessChose === 'customize') {
          inquirer
            .prompt([
              {
                type: 'checkbox',
                message: '🌱 Choose one or more formats',
                name: 'formats',
                choices: ['prettier', 'eslint', 'stylelint'],
              },
            ])
            .then(({ formats }) => {
              if (formats) {
                cleanness
                  .filter(item => formats.findIndex(key => item.includes(key)) > -1)
                  .forEach(item => changeFile(join(__dirname, 'dist', item), join(cwd, item)))
              }
            })
        } else {
          cleanness.forEach(item => changeFile(join(__dirname, 'dist', item), join(cwd, item)))
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

async function changeFile(src, dest) {
  try {
    const data = await fs.readFile(src)
    const str = data
      .toString()
      .replace(`require('./dist/index')`, `require(${packageProject.name})`)
    await fs.writeFile(dest, str)
  } catch (error) {}
}
