<template>
  <span v-if="iconSrc" class="icon-wrapper" :style="wrapperStyle">
    <img :src="iconSrc" :alt="alt" :width="size" :height="size" :style="imgStyle as any" />
  </span>
  <span v-else class="icon-missing">?</span>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { toRefs } from 'vue'

const props = defineProps({
  name: { type: String, required: true },
  alt: { type: String, default: '' },
  size: { type: [Number, String], default: 32 },
  type: { type: String, default: 'png' }, // 'png' or 'svg'
})

const { name, alt, size, type } = toRefs(props)

const iconSrc = computed(() => {
  // Try PNG first, fallback to SVG
  const base = `/src/assets/icons/${name.value}`
  if (type.value === 'svg') {
    return `${base}.svg`
  }
  // Default: try PNG, fallback to SVG
  try {
    return new URL(`../../assets/icons/${name.value}.png`, import.meta.url).href
  } catch {
    try {
      return new URL(`../../assets/icons/${name.value}.svg`, import.meta.url).href
    } catch {
      return ''
    }
  }
})

const wrapperStyle = computed(() => ({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: `${size.value}px`,
  height: `${size.value}px`,
  background: 'none',
  borderRadius: '0',
  overflow: 'hidden',
}))

const imgStyle = computed(() => ({
  width: '100%',
  height: '100%',
  objectFit: 'contain' as const,
  background: 'none',
}))
</script>

<style scoped>
.icon-wrapper {
  vertical-align: middle;
}
.icon-missing {
  color: #ccc;
  font-size: 1.5em;
}
</style>
