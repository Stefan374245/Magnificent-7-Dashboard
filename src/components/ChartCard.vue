<template>
  <div class="chart-card" :style="cardStyle">
    <h2 class="chart-card__title">{{ title }}</h2>
    <div class="chart-card__content">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  title: string
  width?: number
  height?: number
}

const props = withDefaults(defineProps<Props>(), {
  width: 714,
  height: 352,
})

const cardStyle = computed(() => ({
  maxWidth: `${props.width}px`,
  minHeight: `${props.height}px`,
}))
</script>

<style scoped>
.chart-card {
  background-color: var(--color-background);
  border-radius: var(--border-radius-md);
  padding: var(--spacing-lg) var(--spacing-xl);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
  flex: 1;
  min-width: 300px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease;
}

.chart-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
}

.chart-card__title {
  font-family: var(--font-family-secondary);
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text);
  margin: 0;
  line-height: 1.2;
}

.chart-card__content {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 200px;
}

/* Responsive */
@media (max-width: 768px) {
  .chart-card {
    padding: var(--spacing-md) var(--spacing-lg);
    min-width: unset;
  }

  .chart-card__title {
    font-size: var(--font-size-md);
  }
}
</style>
