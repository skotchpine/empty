import {getOptions} from 'loader-utils'

import lex from 'pug-lexer'
import stripComments from 'pug-strip-comments'
import parse from 'pug-parser'

export default (source) => {
  const options = getOptions(source)
  const tokensWithComments = lex(source, options)
  const tokens = stripComments(tokensWithComments, options)
  const ast = parse(tokens)
  return `import React from 'react';\nexport default () => ${compile(ast)};`
}

const compile = (ast) => visitNode(ast)

const visitNode = (node) => {
  switch (node.type) {
    case 'Block':
      return visitBlock(node)

    case 'Tag':
      return visitTag(node)

    case 'Text':
      return visitText(node)

    default:
      throw new Error(`unknown Node type: ${node.type}`)
  }
}

const visitBlock = (block) => {
  if (block.nodes.length < 1) {
    return 'React.createElement(React.Fragment, {}, [])'
  }

  const compiled = block.nodes.map((node) => visitNode(node))
  return `React.createElement(React.Fragment, {}, [${compiled.join(', ')}])`
}

const visitTag = (tag) =>
  `React.createElement('${tag.name}', {}, ${visitBlock(tag.block)})`

const visitText = (text) => `'${text.val}'`
