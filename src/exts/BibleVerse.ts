import { Node, mergeAttributes } from '@tiptap/core'
import { Node as ProseMirrorNode } from 'prosemirror-model'
import { PluginKey } from 'prosemirror-state'
// @ts-ignore
import Suggestion, { SuggestionOptions } from '@tiptap/suggestion'
import {VueNodeViewRenderer} from "@tiptap/vue-3";
import Verse from "../components/Verse.vue";
import tipAttr from './tipAttr_util';

export type BibleVerseOptions = {
    HTMLAttributes: Record<string, any>,
    renderLabel: (props: {
        options: BibleVerseOptions,
        node: ProseMirrorNode,
    }) => string,
    suggestion: Omit<SuggestionOptions, 'editor'>,
}

export const BibleVersePluginKey = new PluginKey('bible-verse')

export const BibleVerse = Node.create({
    name: 'bible-verse',

    draggable: true,
    group: 'inline',
    inline: true,
    atom: true,

    addAttributes() {
        return {
            id: tipAttr('id'),
            ch: tipAttr('ch'),
            from: tipAttr('from'),
            to: tipAttr('to'),
        }
    },

    parseHTML() {
        return [
            {
                tag: 'bible-verse',
            },
        ]
    },

    renderHTML({ node, HTMLAttributes }) {
        return [
            'bible-verse',
            mergeAttributes({ 'data-type': this.name }, this.options.HTMLAttributes, HTMLAttributes),
        ]
    },

    renderText({ node }) {
        return node.text || ''
    },

    addNodeView() {
        return VueNodeViewRenderer(Verse)
    },
})