<template>
  <span class="status-pill" :class="[status.toLowerCase(), fontSize]">
    <span class="dot"></span>
    {{ status }}
  </span>
</template>

<script setup lang="ts">
defineProps<{
  status: string
  fontSize?: string
}>()
</script>

<style scoped>
.status-pill {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  letter-spacing: 0.5px;
}

.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  display: inline-block;
}

.good {
  background-color: #e6f4ea;
  color: #1e7e34;
}
.good .dot {
  background-color: #1e7e34;
}

.improved {
  background-color: #fff3cd;
  color: #856404;
}
.improved .dot {
  background-color: #ffc107;
}

.followup {
  background-color: #f8d7da;
  color: #721c24;
}
.followup .dot {
  background-color: #dc3545;
}

.fs-6 {
  font-size: 0.9rem;
}
</style>
