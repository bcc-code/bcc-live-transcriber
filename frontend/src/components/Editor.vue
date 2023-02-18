<template>
  <editor-content :editor="E" />
</template>

<script setup lang="ts">
import {Editor, EditorContent, getSchema} from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import {onBeforeUnmount, onMounted, ref, watch} from "vue";
import {BibleBook} from "../exts/BibleBook";
import {BibleVerse} from "../exts/BibleVerse";

import Collaboration from "@tiptap/extension-collaboration"
import { HocuspocusProvider } from "@hocuspocus/provider"
import { prosemirrorJSONToYDoc, yDocToProsemirrorJSON } from "y-prosemirror";

const props = defineProps({
  modelValue: {
    type: [Object, String],
    default: () => {},
  },
  editable: {
    type: Boolean,
    default: false,
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

// Set up the Hocuspocus WebSocket provider
new HocuspocusProvider({
  url: `wss://horten-transcriber.up.railway.app`,
  name: 'b789397f-c9e9-4679-a97a-a458f4ff51f1',
  parameters: {
    readOnly: props.editable ? false : true,
  },
  document: ydoc
})

ydoc.on("update", (update: Uint8Array) => {
  console.log("updated", update.length)
})

onMounted(() => {
  E.value = new Editor({
    editable: props.editable,
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