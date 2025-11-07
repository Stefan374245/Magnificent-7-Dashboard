<template>
  <div class="pie-chart">
    <svg viewBox="0 0 300 300" class="chart-svg">
      <!-- Pie Chart Segments -->
      <g transform="translate(150, 150)">
        <path
          v-for="(segment, index) in segments"
          :key="segment.name"
          :d="segment.path"
          :fill="getColor(index)"
          class="pie-segment"
          @mouseenter="hoveredSegment = index"
          @mouseleave="hoveredSegment = null"
        />
      </g>

      <!-- Center Circle (Donut style) -->
      <circle cx="150" cy="150" r="80" :fill="'var(--color-background)'" />

      <!-- Center Text -->
      <text x="150" y="145" text-anchor="middle" class="center-label">In Billion</text>
      <text x="150" y="165" text-anchor="middle" class="center-label">USD TTM</text>
    </svg>

    <!-- Legend with values -->
    <div class="legend">
      <div
        v-for="(company, index) in companies"
        :key="company.name"
        class="legend-item"
        :class="{ 'is-hovered': hoveredSegment === index }"
      >
        <span class="legend-color" :style="{ backgroundColor: getColor(index) }"></span>
        <div class="legend-text">
          <span class="legend-name">{{ company.name }}</span>
          <span class="legend-value">{{ company.value }}%</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
const props = defineProps<{ sheetData?: string[][] }>()
const hoveredSegment = ref<number | null>(null)

const defaultCompanies = [
  { name: 'Amazon', value: 9.1, color: 'var(--color-chart-7)' },
  { name: 'Google', value: 11.5, color: 'var(--color-chart-6)' },
  { name: 'Apple', value: 17.7, color: 'var(--color-chart-5)' },
  { name: 'Microsoft', value: 17, color: 'var(--color-chart-4)' },
  { name: 'Nvidia', value: 14.7, color: 'var(--color-chart-3)' },
  { name: 'Tesla', value: 5.4, color: 'var(--color-chart-2)' },
  { name: 'Meta', value: 8.7, color: 'var(--color-chart-1)' },
]

const colors = [
  'var(--color-chart-7)', 'var(--color-chart-6)', 'var(--color-chart-5)', 'var(--color-chart-4)', 'var(--color-chart-3)', 'var(--color-chart-2)', 'var(--color-chart-1)'
]
const getColor = (index: number) => colors[index]

const companies = computed(() => {
  if (!props.sheetData || props.sheetData.length === 0) return defaultCompanies
  // Example: [Company, Value] in sheetData
  return props.sheetData.slice(1).map((row: (string | undefined)[], idx: number) => ({
    name: row[0] ?? '',
    value: parseFloat(row[1] ?? '0'),
    color: colors[idx % colors.length]
  }))
})

// Calculate pie chart segments
const segments = computed(() => {
  const total = companies.value.reduce((sum: number, c: { value: number }) => sum + c.value, 0)
  let currentAngle = -90 // Start at top

  return companies.value.map((company: { name: string; value: number }) => {
    const percentage = company.value / total
    const angle = percentage * 360
    const startAngle = currentAngle
    const endAngle = currentAngle + angle

    // Convert angles to radians
    const startRad = (startAngle * Math.PI) / 180
    const endRad = (endAngle * Math.PI) / 180

    // Calculate path for pie segment
    const radius = 120
    const x1 = radius * Math.cos(startRad)
    const y1 = radius * Math.sin(startRad)
    const x2 = radius * Math.cos(endRad)
    const y2 = radius * Math.sin(endRad)

    const largeArcFlag = angle > 180 ? 1 : 0

    const path = [
      `M 0 0`,
      `L ${x1} ${y1}`,
      `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
      `Z`,
    ].join(' ')

    currentAngle = endAngle

    return {
      name: company.name,
      path,
      value: company.value,
    }
  })
})
</script>

<style scoped>
.pie-chart {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-lg);
}

.chart-svg {
  width: 100%;
  max-width: 300px;
  height: auto;
}

.pie-segment {
  cursor: pointer;
  transition: opacity 0.2s ease;
}

.pie-segment:hover {
  opacity: 0.8;
}

.center-label {
  fill: var(--color-text);
  font-size: 11px;
  font-family: var(--font-family-secondary);
  font-weight: var(--font-weight-normal);
}

.legend {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--spacing-sm);
  width: 100%;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-xs);
  border-radius: 4px;
  transition: background-color 0.2s ease;
}

.legend-item:hover,
.legend-item.is-hovered {
  background-color: rgba(255, 255, 255, 0.05);
}

.legend-color {
  width: 16px;
  height: 16px;
  border-radius: 3px;
  flex-shrink: 0;
}

.legend-text {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex: 1;
  gap: var(--spacing-sm);
}

.legend-name {
  font-size: var(--font-size-sm);
  font-family: var(--font-family-secondary);
  color: var(--color-text);
  font-weight: var(--font-weight-normal);
}

.legend-value {
  font-size: var(--font-size-sm);
  font-family: var(--font-family-secondary);
  color: var(--color-text);
  font-weight: var(--font-weight-medium);
}
</style>
