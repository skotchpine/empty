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

  const {mod, args, body, render} = compile(ast)
  return `import React from 'react';\n${mod}export default (${args}) => {\n${body}return ${render};\n};\n`
}

const compile = (ast) => {
  var mod = '', args = '{', body = '', render = ''

  ast.nodes.forEach(node => {
    if (node.type == 'Code') {
      if (node.buffered) {
        throw new Error(`Buffered code is not allowed at top level`)
      }
      mod += `${node.val};\n`
      return
    }

    if (node.name == 'component') {
      if (node.attrs.length) {
        node.attrs.forEach((attr, i) => {
          if (i > 0) args += ', '
          args += attr.name
          if (attr.val && attr.val !== true) args += `=${attr.val}`
        })
      }
      args += '}'

      const [b, r] = visitorsByType.Block(node.block, true)
      if (b.length) body = b
      if (r.length) render = r

      return
    }

    throw new Error(`Element type not allowed at top level: ${node.type}.${node.name}`)
  })

  return {mod, args, body, render}
}

const visitNode = (node) => {
  const visitor = visitorsByType[node.type]
  if (!visitor) {
    throw new Error(`unknown Node type: ${node.type}`)
  }
  return visitor(node)
}

const visitorsByType = {
  Block: (block, isRoot) => {
    var code = ''
    var children = []
    block.nodes.forEach((node) => {
      const [c, ch] = visitNode(node)
      if (c.length) code += `${c};\n`
      if (ch.length) children.push(ch)
    })

    if (children.length < 1) {
      return isRoot
        ? [code, 'React.createElement(React.Fragment, {}, null)']
        : [code, 'null']
    }

    if (children.length < 2 && block.nodes[0].type !== 'Each') {
      return [code, children]
    }

    return isRoot
      ? [code, `React.createElement(React.Fragment, {}, ${children.join(', ')})`]
      : [code, children.join(', ')]
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

    const [code, children] = visitorsByType.Block(tag.block)
    return [code, `React.createElement('${tag.name}', ${attrs}, ${children})`]
  },

  Each: (each) => {
    var params = each.val
    if (each.key) {
      params += `, ${each.key}`
    }

    const [code, children] = visitorsByType.Block(each.block, true)
    return ['', `${each.obj}.map((${params}) => {\n${code}return ${children};\n})`]
  },

  Text: (text) => ['', `'${text.val.replace("'", "\\'")}'`],

  Code: (code) => {
    return code.buffer
      ? ['', code.val]
      : [code.val, '']
  },

  Filter: (filter) => {
    console.log(filter, filter.block.nodes)
    return ['', '']
  },

  Conditional: (cond) => {
    const branch = (node) => {
      if (!node) return 'null'

      const [code, render] = visitNode(node)

      var out = '(()=>{\n'
      if (code.length) out += code
      out += render
      out += ';\n})()'
      return out
    }

    return ['', `${cond.test} ? ${branch(cond.consequent)} : ${branch(cond.alternate)}`]
  }
}
