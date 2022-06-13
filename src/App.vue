<script setup lang="ts">
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://vuejs.org/api/sfc-script-setup.html#script-setup
import Editor from './components/Editor.vue'
import {ref, watch} from "vue";

const content = ref({
  type: "doc",
  content: [],
})

const scroller = ref<Element>()
watch(content, (newVal) => {
  if (scroller.value) {
    console.log('scrolling')
    scroller.value.scrollTop = scroller.value.scrollHeight
  }
})
</script>

<template>
  <div class="bg-gray-100 p-4 w-screen h-screen overflow-y-auto" ref="scroller">
    <Editor v-model="content" class="p-1 text-lg bg-white"/>
    <pre class="p-4">
  # Stor title | ## Mindre stor title | ###
  @Bibelvers 3:1-2
  --- Horizontal linje
  *Italic text* | Cmd+I
  **Bold text** | Cmd+B
  ***Bold and italic text*** | Cmd+B Cmd+I
  ~~Strikethrough text~~
    </pre>
  </div>
</template>

<style>
</style>