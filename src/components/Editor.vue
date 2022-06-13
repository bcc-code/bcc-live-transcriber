<template>
  <editor-content :editor="E" />
</template>

<script setup lang="ts">
import {Editor, EditorContent, getSchema, VueRenderer} from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import {onBeforeUnmount, onMounted, ref, watch} from "vue";
import {BibleBook} from "../exts/BibleBook";
import {BibleVerse} from "../exts/BibleVerse";

import Collaboration from "@tiptap/extension-collaboration"
import { HocuspocusProvider } from "@hocuspocus/provider"
import * as Y from 'yjs'
import { prosemirrorJSONToYDoc, yDocToProsemirrorJSON } from "y-prosemirror";
import * as awarenessProtocol from 'y-protocols/awareness.js'
import { WebrtcProvider } from 'y-webrtc'
import { IndexeddbPersistence } from 'y-indexeddb'

const props = defineProps({
  modelValue: {
    type: [Object, String],
    default: () => {},
  }
})

const emits = defineEmits(['update:modelValue'])

const E = ref<any>()

const extensions = [
  StarterKit.configure({
    // The Collaboration extension comes with its own history handling
    history: false,
  }),
  BibleBook,
  BibleVerse,
]

const schema = getSchema(extensions);
const ydoc = prosemirrorJSONToYDoc(schema, props.modelValue);

const proseMirrorJson = yDocToProsemirrorJSON(ydoc);

const editable = !! location.search.includes('admin')

// Registered with a WebRTC provider
const provider = new WebrtcProvider('2c89346f-5a0d-48ff-9af1-aa371d1b2213', ydoc, {
  awareness: new awarenessProtocol.Awareness(ydoc),
  maxConns: null, password: null, peerOpts: null,
  signaling: ['wss://signaling.yjs.dev', 'wss://y-webrtc-signaling-eu.herokuapp.com', 'wss://y-webrtc-signaling-us.herokuapp.com'],
  filterBcConns: true
})
// Set up the Hocuspocus WebSocket provider
new HocuspocusProvider({
  url: `ws://127.0.0.1:1234`, // ?${editable ? 'admin' : 'readonly=true'}
  name: '2c89346f-5a0d-48ff-9af1-aa371d1b2213',
  document: ydoc
})

// new IndexeddbPersistence('2c89346f-5a0d-48ff-9af1-aa371d1b2213', ydoc)

ydoc.on("update", (update: Uint8Array) => {
  console.log("updated", update.length)
})

onMounted(() => {
  E.value = new Editor({
    editable,
    extensions: [
      Collaboration.configure({
        document: ydoc,
      }),
      ...extensions,
    ],
    content: proseMirrorJson,
    onUpdate: () => {
      // HTML
      // this.$emit('update:modelValue', this.editor.getHTML())
      // JSON
      emits('update:modelValue', E.value.getJSON())
    },
  })


  watch(() => props.modelValue, (value) => {
    // HTML
    //const isSame = E.value.getHTML() === value

    // JSON
    const isSame = JSON.stringify(E.value.getJSON()) === JSON.stringify(value)

    if (isSame) {
      return
    }

    // E.value.commands.setContent(value, false)
  }, { immediate: true})
})

onBeforeUnmount(() => {
  E.value?.destroy()
})
</script>

<style lang="scss">
/* Basic editor styles */
.ProseMirror {
  @apply focus:outline-none;

  h1 {
    @apply text-4xl my-2;
  }

  h2 {
    @apply text-3xl my-3;
  }

  h3 {
    @apply text-2xl my-4;
  }

  h4 {
    @apply text-xl my-5;
  }
}
</style>