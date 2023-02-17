import { Node, mergeAttributes } from '@tiptap/core'
import { Node as ProseMirrorNode } from 'prosemirror-model'
import { PluginKey } from 'prosemirror-state'
// @ts-ignore
import Suggestion, { SuggestionOptions } from '@tiptap/suggestion'
import {VueRenderer} from "@tiptap/vue-3";
import ChoiceList from "../components/ChoiceList.vue";
import tippy from "tippy.js";
import books from "../nb_bible.json";
import tipAttr from './tipAttr_util';

export type BibleBookOptions = {
    HTMLAttributes: Record<string, any>,
    renderLabel: (props: {
        options: BibleBookOptions,
        node: ProseMirrorNode,
    }) => string,
    suggestion: Omit<SuggestionOptions, 'editor'>,
}

export const BibleBookPluginKey = new PluginKey('bible-book')

export const BibleBook = Node.create<BibleBookOptions>({
    name: 'bible-book',

    addOptions() {
        return {
            HTMLAttributes: {},
            renderLabel({ options, node }) {
                return `${options.suggestion.char}${node.attrs.name ?? node.attrs.id}`
            },
            suggestion: {
                char: '@',
                pluginKey: BibleBookPluginKey,
                command: ({ editor, range, props }: any) => {
                    // increase range.to by one when the next node is of type "text"
                    // and starts with a space character
                    const nodeAfter = editor.view.state.selection.$to.nodeAfter
                    const overrideSpace = nodeAfter?.text?.startsWith(' ')

                    if (overrideSpace) {
                        range.to += 1
                    }

                    editor
                        .chain()
                        .focus()
                        .insertContentAt(range, [
                            {
                                type: 'bible-verse',
                                attrs: {
                                    id: props.id
                                }
                            },
                            {
                                type: 'paragraph',
                                context: ' '
                            }
                        ])
                        .run()
                },
                allow: ({ state, range }: any) => {
                    const $from = state.doc.resolve(range.from)
                    const type = state.schema.nodes[this.name]
                    const allow = !!$from.parent.type.contentMatch.matchType(type)

                    return allow
                },

                items: async ({ query }: any) => {
                    if (query) {
                        const q = query.toLowerCase()
                        return books.filter(({name, short}) => name.toLowerCase().includes(q) || short.toLowerCase().includes(q))
                    }

                    return books
                },

                render: () => {
                    let component: any;
                    let popup: any;

                    return {
                        onStart: (props: any) => {
                            component = new VueRenderer(ChoiceList, {
                                props,
                                editor: props.editor,
                            })

                            if (!props.clientRect) {
                                return
                            }

                            popup = tippy('body', {
                                getReferenceClientRect: props.clientRect,
                                appendTo: () => document.body,
                                content: component.element,
                                showOnCreate: true,
                                interactive: true,
                                trigger: 'manual',
                                placement: 'top-start',
                            })
                        },

                        onUpdate(props: any) {
                            component.updateProps(props)

                            if (!props.clientRect) {
                                return
                            }

                            popup[0].setProps({
                                getReferenceClientRect: props.clientRect,
                            })
                        },

                        onKeyDown(props: any) {
                            if (props.event.key === 'Escape') {
                                popup[0].hide()

                                return true
                            }

                            return component.ref?.onKeyDown(props)
                        },

                        onExit() {
                            popup[0].destroy()
                            component.destroy()
                        },
                    }
                },
            },
        }
    },

    group: 'inline',
    inline: true,
    selectable: false,
    atom: true,

    addAttributes() {
        return {
            id: tipAttr('id'),
            label: tipAttr('label'),
        }
    },

    parseHTML() {
        return [
            {
                tag: `span[data-type="${this.name}"]`,
            },
        ]
    },

    renderHTML({ node, HTMLAttributes }) {
        return [
            'bible-verse',
            mergeAttributes({ 'data-type': this.name }, this.options.HTMLAttributes, HTMLAttributes)
        ]
    },

    renderText({ node }) {
        return this.options.renderLabel({
            options: this.options,
            node,
        })
    },

    addKeyboardShortcuts() {
        return {
            Backspace: () => this.editor.commands.command(({ tr, state }) => {
                let isBibleBook = false
                const { selection } = state
                const { empty, anchor } = selection

                if (!empty) {
                    return false
                }

                state.doc.nodesBetween(anchor - 1, anchor, (node, pos) => {
                    if (node.type.name === this.name) {
                        isBibleBook = true
                        tr.insertText(this.options.suggestion.char || '', pos, pos + node.nodeSize)

                        return false
                    }
                })

                return isBibleBook
            }),
        }
    },

    addProseMirrorPlugins() {
        return [
            Suggestion({
                editor: this.editor,
                ...this.options.suggestion,
            }),
        ]
    },
})