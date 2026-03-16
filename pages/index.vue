<script setup lang="ts">
import ResumePage from '~/components/ResumePage.vue'
import { useResumeSeo } from '~/composables/useResumeSeo'

useResumeSeo('zh')
</script>

<template>
  <ResumePage locale="zh" />
</template>
