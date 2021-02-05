const {getOptions} = require('loader-utils')

const lex = require('pug-lexer')
const stripComments = require('pug-strip-comments')
const parse = require('pug-parser')
const { transform } = require('@babel/core')

module.exports = (source) => {
  const options = getOptions(source)
  const tokensWithComments = lex(source, options)
  const tokens = stripComments(tokensWithComments, options)
  const ast = parse(tokens)
  return `import React from 'react';\nexport default () => ${compile(ast)};`
}

const compile = (ast) => visitNode(ast, true)

const visitNode = (node, isRoot) => {
  const visitor = visitorsByType[node.type]
  if (!visitor) {
    throw new Error(`unknown Node type: ${node.type}`)
  }
  return visitor(node, isRoot)
}

const visitorsByType = {
  Block: (block, isRoot) => {
    if (block.nodes.length < 1) {
      return isRoot ? 'React.createElement(React.Fragment, {}, null)' : null
    }
    const children = block.nodes.map((node) => visitNode(node))
    if (children.length < 2 && block.nodes[0].type !== 'Each') {
      return children
    }
    return isRoot
      ? `React.createElement(React.Fragment, {}, ${children.join(', ')})`
      : children.join(', ')
  },

  Tag: (tag) => {
    var attrs = '{'
    if (tag.attrs) {
      tag.attrs.forEach((attr, i) => {
        attrs += `${attr.name}: ${attr.val}`
        if (i + 1 < tag.attrs.length) {
          attrs += ', '
        }
      })
    }
    attrs += '}'

    const children = visitorsByType.Block(tag.block)
    return `React.createElement('${tag.name}', ${attrs}, ${children})`
  },

  Each: (each) => {
    var params = each.val
    if (each.key) {
      params += `, ${params}`
    }

    const children = visitorsByType.Block(each.block, true)
    return `${each.obj}.map((${params}) => ${children})`
  },

  Text: (text) => `'${text.val}'`,
  Code: (code) => code.val,

  Filter: (filter) => console.log(filter, filter.block.nodes),
}
