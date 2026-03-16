<script setup lang="ts">
import ResumePage from '~/components/ResumePage.vue'
import { useResumeSeo } from '~/composables/useResumeSeo'

useResumeSeo('en')
</script>

<template>
  <ResumePage locale="en" />
</template>
