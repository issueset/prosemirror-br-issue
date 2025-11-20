import 'prosemirror-tables/style/tables.css'
import 'prosemirror-view/style/prosemirror.css'
import './style.css'

import { DOMParser, Schema } from 'prosemirror-model'
import { schema as basicSchema } from 'prosemirror-schema-basic'
import { EditorState, type Plugin } from 'prosemirror-state'
import { EditorView } from 'prosemirror-view'

function createSchema() {
  const marks = basicSchema.spec.marks
  let nodes = basicSchema.spec.nodes

  nodes = nodes.append({
    node_inline_block: {
      inline: true,
      group: 'inline',
      atom: true,
      parseDOM: [
        {
          tag: 'span[data-node-inline-block]',
        },
      ],
      toDOM: () => {
        return [
          'span',
          {
            'data-node-inline-block': 'true',
            style: `display: inline-block; border: 1px solid red; margin: 4px; padding: 2px;`,
          },
          ['span', { 'data-text': '' }, 'inline-block'],
        ]
      },
    },
    node_inline_flex: {
      inline: true,
      group: 'inline',
      atom: true,
      parseDOM: [
        {
          tag: 'span[data-node-inline-flex]',
        },
      ],
      toDOM: () => {
        return [
          'span',
          {
            'data-node-inline-flex': 'true',
            style: `display: inline-flex; border: 1px solid blue; margin: 4px; padding: 2px;`,
          },
          ['span', { 'data-text': '' }, 'inline-flex'],
        ]
      },
    },
  })

  return new Schema({
    nodes,
    marks,
  })
}

function createView(schema: Schema, plugins: Plugin[]) {
  return new EditorView(document.querySelector('#editor'), {
    state: EditorState.create({
      doc: schema.nodeFromJSON({
        type: 'doc',
        content: [
          {
            type: 'paragraph',
            content: [
              { type: 'text', text: 'A' },
              { type: 'node_inline_block' },
              { type: 'text', text: 'B' },
            ],
          },
          {
            type: 'paragraph',
            content: [
              { type: 'text', text: 'C' },
              { type: 'node_inline_flex' },
              { type: 'text', text: 'D' },
            ],
          },
        ],
      }),
      plugins,
    }),
  })
}

function main() {
  const schema = createSchema()
  const view = createView(schema, [])
  window.view = view
}

main()

declare global {
  interface Window {
    view?: EditorView
  }
}
