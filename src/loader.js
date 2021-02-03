const {getOptions} = require('loader-utils')

const lex = require('pug-lexer')
const stripComments = require('pug-strip-comments')
const parse = require('pug-parser')

module.exports = (source) => {
  const options = getOptions(source)
  const tokensWithComments = lex(source, options)
  const tokens = stripComments(tokensWithComments, options)
  const ast = parse(tokens)
  return `import React from 'react';\nexport default () => ${compile(ast)};`
}

const compile = (ast) => visitNode(ast, true)

const visitNode = (node, isRoot) => {
  switch (node.type) {
    case 'Block':
      return visitBlock(node, isRoot)

    case 'Tag':
      return visitTag(node)

    case 'Text':
      return visitText(node)

    default:
      throw new Error(`unknown Node type: ${node.type}`)
  }
}

const visitBlock = (block, isRoot) => {
  if (block.nodes.length < 1) {
    return isRoot ? 'React.createElement(React.Fragment, {}, null)' : null
  }

  const compiled = block.nodes.map((node) => visitNode(node))
  if (compiled.length < 2) {
    return compiled
  }
  return isRoot
    ? `React.createElement(React.Fragment, {}, ${compiled.join(', ')})`
    : compiled.join(', ')
}

const visitTag = (tag) =>
  `React.createElement('${tag.name}', {}, ${visitBlock(tag.block)})`

const visitText = (text) => `'${text.val}'`
