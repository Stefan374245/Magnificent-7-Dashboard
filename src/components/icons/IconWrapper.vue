<template>
  <img
    :src="iconUrl"
    :alt="alt"
    :width="width"
    :height="height"
    :class="['icon', iconClass]"
    :style="iconStyle"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  name: string
  width?: number | string
  height?: number | string
  color?: string
  alt?: string
  class?: string
}

const props = withDefaults(defineProps<Props>(), {
  width: 24,
  height: 24,
  alt: 'icon',
  class: '',
})

const iconUrl = computed(() => {
  try {
    return new URL(`../../assets/icons/${props.name}.svg`, import.meta.url).href
  } catch (e) {
    console.warn(`Icon not found: ${props.name}`)
    return ''
  }
})

const iconClass = computed(() => props.class)

const iconStyle = computed(() => ({
  width: typeof props.width === 'number' ? `${props.width}px` : props.width,
  height: typeof props.height === 'number' ? `${props.height}px` : props.height,
  filter: props.color ? `brightness(0) saturate(100%) ${getColorFilter(props.color)}` : undefined,
}))

function getColorFilter(color: string): string {
  // Vereinfachte Farbfilter für SVGs
  if (color === 'primary') return 'invert(62%) sepia(97%) saturate(3084%) hue-rotate(172deg)'
  if (color === 'success') return 'invert(59%) sepia(31%) saturate(1347%) hue-rotate(86deg)'
  if (color === 'error') return 'invert(23%) sepia(85%) saturate(4051%) hue-rotate(351deg)'
  return ''
}
</script>

<style scoped>
.icon {
  display: inline-block;
  vertical-align: middle;
  flex-shrink: 0;
}
</style>
