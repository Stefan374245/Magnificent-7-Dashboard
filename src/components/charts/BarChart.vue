<template>
  <div class="bar-chart">
    <svg :viewBox="`0 0 ${svgWidth} 280`" class="chart-svg">
      <!-- Y-Axis Labels -->
      <text v-for="(label, i) in yAxisLabels" :key="i" x="10" :y="260 - i * 60" class="axis-label">
        {{ label }}
      </text>

      <!-- Grid Lines -->
      <line
        v-for="i in 5"
        :key="i"
        x1="50"
        :y1="260 - (i - 1) * 60"
        :x2="svgWidth - 20"
        :y2="260 - (i - 1) * 60"
        class="grid-line"
      />

      <!-- Bars -->
      <g v-for="(item, index) in chartData" :key="item.name">
        <rect
          :x="70 + index * barSpacing"
          :y="260 - item.height"
          :width="barWidth"
          :height="item.height"
          :fill="getColor(index)"
          class="bar"
          @mouseenter="hoveredBar = index"
          @mouseleave="hoveredBar = null"
        />

        <!-- Value on top of bar -->
        <text
          :x="70 + index * barSpacing + barWidth / 2"
          :y="260 - item.height - 10"
          text-anchor="middle"
          class="bar-value"
        >
          {{ item.displayValue }}
        </text>
      </g>

      <!-- X-Axis Labels + Logos -->
      <g class="x-axis-labels">
        <text
          v-for="(item, index) in chartData"
          :key="item.name"
          :x="70 + index * barSpacing + barWidth / 2"
          y="275"
          text-anchor="middle"
          class="axis-label-small"
        >
          {{ item.name }}
        </text>
        <!-- Firmenlogo unter jedem Balken -->
        <image
          v-for="(item, index) in chartData"
          :key="item.name + '-logo'"
          :x="70 + index * barSpacing + barWidth / 2 - 12"
          y="285"
          width="24"
          height="24"
          :href="logoMap[item.name]"
        />
      </g>
    </svg>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface Props {
  chartType: 'netIncome' | 'grossMargin' | 'revenueGrowth'
}

const props = defineProps<Props>()
const hoveredBar = ref<number | null>(null)

const colors = [
  'var(--color-chart-7)', // Amazon
  'var(--color-chart-1)', // Meta
  'var(--color-chart-6)', // Alphabet
  'var(--color-chart-4)', // Microsoft
  'var(--color-chart-5)', // Apple
  'var(--color-chart-3)', // Nvidia
  'var(--color-chart-2)', // Tesla
]

const getColor = (index: number) => colors[index]

// Data for different chart types
const dataByType = {
  netIncome: {
    companies: ['Amazon', 'Meta', 'Alphabet', 'Microsoft', 'Apple', 'Nvidia', 'Tesla'],
    values: [3.16, 6.81, 24.51, 26.25, 39.5, 40.15, 62.62],
    maxValue: 100,
    yAxisLabels: ['0', '20', '40', '80', '100'],
    unit: '',
  },
  grossMargin: {
    companies: ['Amazon', 'Meta', 'Alphabet', 'Microsoft', 'Apple', 'Nvidia', 'Tesla'],
    values: [5.7, 6.2, 12.2, 12.5, 12.7, 24.3, 24.8],
    maxValue: 30,
    yAxisLabels: ['0', '10', '20', '30', '40'],
    unit: '%',
  },
  revenueGrowth: {
    companies: ['Amazon', 'Meta', 'Alphabet', 'Microsoft', 'Apple', 'Nvidia', 'Tesla'],
    values: [12, 23, 15, 17, 8, 126, 49],
    maxValue: 150,
    yAxisLabels: ['0', '10', '30', '50', '70'],
    unit: '%',
  },
}

const currentData = computed(() => dataByType[props.chartType])

const chartData = computed(() => {
  return currentData.value.companies.map((name, index) => {
    const value = currentData.value.values[index]
    const height = (value / currentData.value.maxValue) * 240
    return {
      name,
      value,
      height,
      displayValue: `${value}${currentData.value.unit}`,
    }
  })
})

const yAxisLabels = computed(() => currentData.value.yAxisLabels)

const barWidth = computed(() => {
  const count = chartData.value.length
  return props.chartType === 'revenueGrowth' ? 60 : 50
})

const barSpacing = computed(() => {
  const count = chartData.value.length
  return props.chartType === 'revenueGrowth' ? 100 : 80
})

const svgWidth = computed(() => {
  return 100 + chartData.value.length * barSpacing.value
})

const logoMap: Record<string, string> = {
  Amazon: new URL('@/assets/icons/amazon.png', import.meta.url).href,
  Meta: new URL('@/assets/icons/meta.png', import.meta.url).href,
  Alphabet: new URL('@/assets/icons/google.png', import.meta.url).href,
  Microsoft: new URL('@/assets/icons/microsoft.png', import.meta.url).href,
  Apple: new URL('@/assets/icons/apple.png', import.meta.url).href,
  Nvidia: new URL('@/assets/icons/nvidia.png', import.meta.url).href,
  Tesla: new URL('@/assets/icons/tsla.png', import.meta.url).href,
}
</script>

<style scoped>
.bar-chart {
  width: 100%;
}

.chart-svg {
  width: 100%;
  height: auto;
}

.axis-label {
  fill: var(--color-text);
  font-size: 11px;
  font-family: var(--font-family-secondary);
}

.axis-label-small {
  fill: var(--color-text);
  font-size: 9px;
  font-family: var(--font-family-secondary);
}

.grid-line {
  stroke: rgba(255, 255, 255, 0.1);
  stroke-width: 1;
}

.bar {
  cursor: pointer;
  transition: opacity 0.2s ease;
}

.bar:hover {
  opacity: 0.8;
}

.bar-value {
  fill: var(--color-text);
  font-size: 11px;
  font-family: var(--font-family-secondary);
  font-weight: var(--font-weight-normal);
}
</style>
