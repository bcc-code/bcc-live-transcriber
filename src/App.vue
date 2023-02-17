<script setup lang="ts">
import Editor from './components/Editor.vue'
import {ref, watch} from "vue";

const content = ref({
  type: "doc",
  content: [],
})

const scroller = ref<Element>()
watch(content, (newVal) => {
  if (scroller.value) {
    scroller.value.scrollTop = scroller.value.scrollHeight
  }
})

const editable = !! location.search.includes('admin')
</script>

<template>
  <div class="bg-gray-100 p-4 w-screen h-screen overflow-y-auto" ref="scroller">
    <Editor :editable="editable" v-model="content" class="p-1 text-lg bg-white"/>
    <details v-if="editable">
      <summary>Vis Hjelp</summary>
      <pre class="p-4">
    # Stor title | ## Mindre stor title | ###
    [@] + (biblebok navn) + [mellomrom] + (kaptital nummer) + [:] + (fra vers nummer) + [-] + (til vers nummer)
    @Bibelvers 3:1-2
    --- Horizontal linje
    *Italic text* | Cmd+I
    **Bold text** | Cmd+B
    ***Bold and italic text*** | Cmd+B Cmd+I
    ~~Strikethrough text~~
      </pre>
    </details>
  </div>
</template>

<style>
</style>