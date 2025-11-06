<template>
  <div class="line-chart">
    <svg viewBox="0 0 650 240" class="chart-svg">
      <!-- Y-Axis Labels -->
      <text x="10" y="20" class="axis-label">90</text>
      <text x="10" y="80" class="axis-label">60</text>
      <text x="10" y="140" class="axis-label">30</text>
      <text x="10" y="200" class="axis-label">0</text>

      <!-- Grid Lines -->
      <line x1="40" y1="20" x2="640" y2="20" class="grid-line" />
      <line x1="40" y1="80" x2="640" y2="80" class="grid-line" />
      <line x1="40" y1="140" x2="640" y2="140" class="grid-line" />
      <line x1="40" y1="200" x2="640" y2="200" class="grid-line" />

      <!-- Line Chart for each company -->
      <polyline
        v-for="(company, index) in companies"
        :key="company.name"
        :points="company.points"
        :stroke="getColor(index)"
        stroke-width="3"
        fill="none"
        class="chart-line"
      />

      <!-- X-Axis Labels -->
      <g class="x-axis-labels">
        <text
          v-for="(quarter, i) in quarters"
          :key="quarter"
          :x="60 + i * 50"
          y="230"
          class="axis-label-small"
        >
          {{ quarter }}
        </text>
      </g>
    </svg>

    <!-- Legend -->
    <div class="legend">
      <div v-for="(company, index) in companies" :key="company.name" class="legend-item">
        <span class="legend-color" :style="{ backgroundColor: getColor(index) }"></span>
        <span class="legend-label">{{ company.name }} {{ company.value }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const quarters = [
  'Q2 2021',
  'Q1 2021',
  'Q3 2021',
  'Q4 2021',
  'Q1 2022',
  'Q2 2022',
  'Q3 2022',
  'Q4 2022',
  'Q1 2023',
  'Q2 2023',
  'Q3 2023',
  'Q4 2023',
  'Q1 2024',
]

const companies = ref([
  {
    name: 'Meta',
    value: '8.7',
    points:
      '60,180 110,170 160,160 210,150 260,140 310,130 360,120 410,110 460,100 510,95 560,90 610,85 650,80',
  },
  {
    name: 'Tesla',
    value: '5.4',
    points:
      '60,190 110,185 160,180 210,175 260,170 310,165 360,160 410,155 460,150 510,145 560,140 610,135 650,130',
  },
  {
    name: 'Nvidia',
    value: '14.7',
    points:
      '60,185 110,178 160,170 210,160 260,145 310,125 360,100 410,75 460,50 510,40 560,35 610,30 650,25',
  },
  {
    name: 'Microsoft',
    value: '17',
    points:
      '60,150 110,145 160,140 210,135 260,130 310,125 360,120 410,115 460,110 510,105 560,100 610,95 650,90',
  },
  {
    name: 'Apple',
    value: '17.7',
    points:
      '60,140 110,138 160,136 210,134 260,132 310,130 360,128 410,126 460,124 510,122 560,120 610,118 650,115',
  },
  {
    name: 'Google',
    value: '11.5',
    points:
      '60,165 110,162 160,158 210,155 260,152 310,148 360,145 410,142 460,138 510,135 560,132 610,128 650,125',
  },
  {
    name: 'Amazon',
    value: '9.1',
    points:
      '60,175 110,173 160,170 210,168 260,165 310,162 360,160 410,157 460,155 510,152 560,150 610,147 650,145',
  },
])

const colors = [
  'var(--color-chart-1)', // Meta
  'var(--color-chart-2)', // Tesla
  'var(--color-chart-3)', // Nvidia
  'var(--color-chart-4)', // Microsoft
  'var(--color-chart-5)', // Apple
  'var(--color-chart-6)', // Google
  'var(--color-chart-7)', // Amazon
]

const getColor = (index: number) => colors[index]
</script>

<style scoped>
.line-chart {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.chart-svg {
  width: 100%;
  height: auto;
}

.axis-label {
  fill: var(--color-text);
  font-size: 10px;
  font-family: var(--font-family-secondary);
}

.axis-label-small {
  fill: var(--color-text);
  font-size: 8px;
  font-family: var(--font-family-secondary);
  text-anchor: middle;
}

.grid-line {
  stroke: rgba(255, 255, 255, 0.1);
  stroke-width: 1;
}

.chart-line {
  transition: stroke-width 0.2s ease;
}

.chart-line:hover {
  stroke-width: 4;
}

.legend {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-sm) var(--spacing-md);
  padding-top: var(--spacing-sm);
}

.legend-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
}

.legend-color {
  width: 12px;
  height: 12px;
  border-radius: 2px;
}

.legend-label {
  font-size: var(--font-size-sm);
  font-family: var(--font-family-secondary);
  color: var(--color-text);
}
</style>
