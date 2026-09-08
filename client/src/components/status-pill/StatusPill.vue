<template>
  <span
    class="badge rounded-pill"
    :class="[fontSize, {
      'bg-success': status === 'IMPROVED',
      'bg-info': status === 'GOOD',
      'bg-warning text-dark': status === 'FOLLOWUP',
      'bg-secondary': status !== 'GOOD' && status !== 'IMPROVED' && status !== 'FOLLOWUP'
    }]"
  >
    {{ status }}
  </span>
</template>

<script setup lang="ts">
defineProps<{
  status: string
  fontSize?: string
}>()
</script>
