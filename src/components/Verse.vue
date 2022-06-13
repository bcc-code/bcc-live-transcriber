<script setup lang="ts">
import {computed, defineProps, nextTick, onMounted, ref, watch} from "vue";
import Inputmask from "inputmask";
import { NodeViewWrapper } from '@tiptap/vue-3';
import { nodeViewProps } from '@tiptap/vue-3';
import books from '../nb_bible.json';
import Api from '../api';

const props = defineProps(nodeViewProps)

const verses = ref<Array<{
  text: string,
  number: number
}>>([])

const book = computed(() => {
  return books.find(b => b.id === props.node.attrs.id) ?? {
    id: null,
    name: 'Not found',
    short: 'NA',
    chpts: 0,
  }
})
const bookChpts = computed(() => {
  return book.value?.chpts ?? 1
})

const info = computed({
  get () {
    const { ch, from, to } = props.node.attrs;
    let output = ''
    if (! ch) return output
    output += `${ch}`
    if (! from) return output
    output += `:${from}${to ? '-' + to : ''}`

    return output
  },
  set (value: string) {
    if (value.includes('_')) {
      return
    }
    const [CH, VERSE] = value.split(':');
    const verse: {
      id: string
      ch: number
      from: number
      to?: number | null
    } = {
      id: props.node.attrs.id,
      ch: parseInt(CH),
      from: 0
    }
    if (bookChpts.value < verse.ch) {
      verse.ch = bookChpts.value
    }
    const [FROM, TO] = VERSE?.split('-') ?? '';
    verse.from = parseInt(FROM);
    verse.to = TO ? parseInt(TO) : null;
    props.updateAttributes(verse)
  }
})

async function LoadVerses() {
  const { id, ch, from, to } = props.node.attrs;
  verses.value = await Api.verses(id, ch, from, to)
}

const verseInfo = ref<HTMLInputElement>()
onMounted(() => {
  if (verseInfo.value) {
    new Inputmask('9[9][9]\\:9[9][9][-9][9][9]').mask(verseInfo.value)
    nextTick(() => {
      if (verseInfo.value && ! props.node.attrs.ch) {
        verseInfo.value.focus()
      }
    })

    verseInfo.value.onblur = LoadVerses
  }
})

watch(props, () => {
  nextTick(LoadVerses)
}, { immediate: true })

function selectNext() {
  props.editor.commands.focus('end')
}
</script>

<template>
  <node-view-wrapper class="dom px-2 my-2 mb-2 border-l-4 border-l-amber-200">
    <div class="flex">
      {{ book.name }}
      <input v-if="editor.isEditable"
             ref="verseInfo"
             v-model="info"
             class="ml-2 w-28 px-0.5 bg-gray-100 rounded focus:outline-none"
             @keydown.tab.capture="selectNext"
             @keydown.enter.capture="selectNext"
      />
      <span v-else class="ml-2">{{info}}</span>
    </div>
    <p v-if="verses.length > 0" class="font-serif text-gray-800">
      <span v-for="(verse, index) in verses" :key="index">
        <sup class="font-bold">{{ verse.number }}</sup> {{ verse.text }}
      </span>
    </p>
  </node-view-wrapper>
</template>

<style scoped>

</style>