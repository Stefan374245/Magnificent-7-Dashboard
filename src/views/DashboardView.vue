<template>
  <div class="dashboard">
    <header class="dashboard-header">
      <h1 class="dashboard-title">
        <span class="title-main">Magnificent 7</span>
        <span class="title-sub">Dashboard</span>
      </h1>
    </header>

    <main class="dashboard-content">
      <div class="charts-row">
        <ChartCard title="Revenue Last 3 Years" :width="714" :height="352">
          <LineChart />
        </ChartCard>

        <ChartCard title="Revenue Breakdown Magnificent Seven" :width="494" :height="352">
          <PieChart />
        </ChartCard>
      </div>

      <div class="charts-row">
        <ChartCard title="Net Income TTM" :width="714" :height="352">
          <BarChart chartType="netIncome" />
        </ChartCard>

        <ChartCard title="Gross Margin in % LQ" :width="494" :height="352">
          <BarChart chartType="grossMargin" />
        </ChartCard>
      </div>

      <div class="charts-row">
        <ChartCard title="Revenue Growth in % YoY" :width="1240" :height="300">
          <BarChart chartType="revenueGrowth" />
        </ChartCard>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import ChartCard from '@/components/ChartCard.vue'
import LineChart from '@/components/charts/LineChart.vue'
import PieChart from '@/components/charts/PieChart.vue'
import BarChart from '@/components/charts/BarChart.vue'
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
  font-family: var(--font-family-primary);
  font-weight: var(--font-weight-bold);
  margin: 0;
}

.title-main {
  display: block;
  font-size: clamp(48px, 8vw, 189px);
  line-height: 1.2;
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
