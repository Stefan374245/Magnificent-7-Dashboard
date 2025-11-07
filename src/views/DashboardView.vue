<template>
  <div class="dashboard">
    <header class="dashboard-header">
      <h1 class="dashboard-title">
        <span class="title-main">The Magnificent Seven Companies</span>
      </h1>

      <!-- Company Logos -->
      <div class="company-logos">
        <IconWrapper name="AAPL" />
        <IconWrapper name="MSFT" />
        <IconWrapper name="GOOGL" />
        <IconWrapper name="AMZN" />
        <IconWrapper name="TSLA" />
        <IconWrapper name="FB" />
        <IconWrapper name="BRK.A" />
      </div>
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

// Beispiel: Daten aus Google Sheets laden
const SHEET_ID = '1m3h9Xce3SRMaq20li2Qg4HuSZowwxQSd9FkQmeuI7Dw'
const API_KEY = 'AIzaSyCYR_4KkcYbdHXGmhAbbcgP8wuIDn4YOPk'
const RANGE = 'MSFT' // oder z.B. 'A1:Z100'

fetch(`https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${RANGE}?key=${API_KEY}`)
  .then((res) => res.json())
  .then((data) => {
    // data.values ist ein Array mit den Zeilen
    console.log(data.values)
  })
</script>

<style scoped>
.dashboard {
  min-height: 100vh;
  background: #06263a;
  color: #eaf6ff;
  padding: 48px 32px;
}

.dashboard-header {
  display: flex;
  gap: 1rem;
  align-items: center;
  margin-bottom: 48px;
}

.dashboard-title {
  display: flex;
  font-family: 'Inter', Arial, sans-serif;
  font-weight: 700;
  margin: 0;
}

.title-main {
  display: block;
  font-size: 32px;
  font-weight: 600;
  line-height: 1;
  color: #eaf6ff;
}

.title-sub {
  display: block;
  font-size: clamp(36px, 5vw, 96px);
  line-height: 1.2;
  color: #00bfff;
  font-weight: 700;
}

.dashboard-content {
  max-width: 1200px;
  margin: 0 auto;
}

/* Company logos row */
.company-logos {
  display: flex;
  gap: 16px;
  align-items: center;
  justify-content: flex-start;
  max-width: 714px;
  margin: 0 0 24px 0;
}

.company-logos :deep(.icon),
.company-logos :deep(.icon-wrapper) {
  background: none;
  border-radius: 0;
  padding: 0;
  box-sizing: content-box;
}

.charts-row {
  display: flex;
  flex-wrap: wrap;
  gap: 32px;
  margin-bottom: 32px;
}
/* ChartCard and chart area styling for dark theme */
.chart-card {
  background: #09304a;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
  padding: 24px 32px;
  color: #eaf6ff;
}

.chart-legend {
  display: flex;
  gap: 18px;
  align-items: center;
  margin-top: 18px;
  flex-wrap: wrap;
}

.chart-legend-item {
  display: flex;
  align-items: center;
  gap: 6px;
  background: #0e3c5c;
  color: #eaf6ff;
  border-radius: 6px;
  padding: 4px 12px;
  font-size: 15px;
  font-weight: 500;
}

.chart-legend-color {
  width: 16px;
  height: 16px;
  border-radius: 4px;
  margin-right: 6px;
}

/* Responsive Design */
@media (max-width: 1280px) {
  .charts-row {
    flex-direction: column;
    gap: 24px;
  }
}

@media (max-width: 768px) {
  .dashboard {
    padding: 24px 12px;
  }
  .charts-row {
    gap: 16px;
  }
  .chart-card {
    padding: 16px 8px;
  }
}
</style>
