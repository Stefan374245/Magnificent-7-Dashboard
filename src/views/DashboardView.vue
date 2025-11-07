<template>
  <div class="dashboard">
    <header class="dashboard-header">
      <h1 class="dashboard-title">
        <span class="title-main">The Magnificent Seven Companies</span>
      </h1>
    </header>

    <main class="dashboard-content">
      <!-- Stock Ticker Header -->
      <StockTicker />

      <div class="charts-row">
        <ChartCard title="Revenue Last 3 Years" :width="714" :height="352">
          <LineChart />
        </ChartCard>

        <ChartCard title="Revenue Breakdown Magnificent Seven" :width="494" :height="352">
          <PieChart />
        </ChartCard>
      </div>

      <div class="charts-row">
        <ChartCard title="Net Income TTM" :width="392" :height="296">
          <BarChart chartType="netIncome" />
        </ChartCard>

        <ChartCard title="Gross Margin in % LQ" :width="293" :height="296">
          <BarChart chartType="grossMargin" />
        </ChartCard>

        <ChartCard title="Revenue Growth in % YoY" :width="491" :height="296">
          <BarChart chartType="revenueGrowth" />
        </ChartCard>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import StockTicker from '@/components/StockTicker.vue'
import ChartCard from '@/components/ChartCard.vue'
import LineChart from '@/components/charts/LineChart.vue'
import PieChart from '@/components/charts/PieChart.vue'
import BarChart from '@/components/charts/BarChart.vue'
import IconWrapper from '@/components/icons/IconWrapper.vue'
</script>

<style scoped>
.dashboard {
  min-height: 100vh;
  background-color: var(--color-background);
  color: var(--color-text);
  padding: var(--spacing-3xl) var(--spacing-xl);
}

.dashboard-header {
  margin-bottom: var(--spacing-3xl);
}

.dashboard-title {
  display: flex;
  font-family: var(--font-family-primary);
  font-weight: var(--font-weight-bold);
  margin: 0;
}

.title-main {
  display: block;
  font-size: 32px;
  font-weight: var(--font-weight-medium);
  line-height: 1;
  color: var(--color-text);
}

.title-sub {
  display: block;
  font-size: clamp(36px, 5vw, 96px);
  line-height: 1.2;
  color: var(--color-primary);
  font-weight: var(--font-weight-semibold);
}

.dashboard-content {
  max-width: var(--container-dashboard-width);
  margin: 0 auto;
}

/* Company logos row */
.company-logos {
  display: flex;
  gap: 12px;
  align-items: center;
  justify-content: flex-start;
  max-width: 714px; /* matches Figma frame width */
  margin: 0 0 var(--spacing-lg) 0;
}

.company-logos :deep(.icon) {
  background: transparent;
  border-radius: 8px;
  padding: 4px;
  box-sizing: content-box;
}

.charts-row {
  display: flex;
  flex-wrap: wrap;
  gap: var(--gap-md);
  margin-bottom: var(--gap-md);
}

/* Responsive Design */
@media (max-width: 1280px) {
  .charts-row {
    flex-direction: column;
  }
}

@media (max-width: 768px) {
  .dashboard {
    padding: var(--spacing-lg) var(--spacing-md);
  }
}
</style>
