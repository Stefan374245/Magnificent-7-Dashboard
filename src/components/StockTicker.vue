<template>
  <div class="stock-ticker">
    <div class="ticker-container">
      <div v-for="stock in stocks" :key="stock.symbol" class="stock-card">
        <div class="stock-header">
          <div class="company-icon">
            <!-- Icon placeholder -->
            <span class="icon-text">{{ stock.symbol.charAt(0) }}</span>
          </div>
          <span class="company-name">{{ stock.name }}</span>
        </div>

        <div class="stock-info">
          <div class="stock-label">Revenue Q1 2024</div>

          <div class="stock-price-row">
            <span class="stock-price">{{ stock.price }}</span>

            <div class="stock-changes">
              <div class="price-change" :class="{ negative: stock.change < 0 }">
                <span class="change-value"
                  >{{ stock.change > 0 ? '+' : '' }}{{ stock.change }}</span
                >
                <span class="arrow-icon">{{ stock.change > 0 ? '↑' : '↓' }}</span>
              </div>

              <div class="percent-change" :class="{ negative: stock.changePercent < 0 }">
                <span class="percent-value">{{ stock.changePercent }}%</span>
                <span class="percent-icon">%</span>
              </div>
            </div>
          </div>

          <div class="stock-unit">In Bill USD</div>
        </div>
      </div>

      <button class="scroll-button">
        <span class="arrow-icon">→</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface Stock {
  symbol: string
  name: string
  price: string
  change: number
  changePercent: number
}

const stocks = ref<Stock[]>([
  { symbol: 'AAPL', name: 'Apple', price: '38.52', change: 1.06, changePercent: 2.83 },
  { symbol: 'META', name: 'Meta', price: '435.57', change: -5.81, changePercent: -1.32 },
  { symbol: 'MSFT', name: 'Microsoft', price: '409.05', change: 1.7, changePercent: 2.51 },
  { symbol: 'GOOGL', name: 'Google', price: '29.87', change: 1.7, changePercent: 6.04 },
  { symbol: 'AMZN', name: 'Amazon', price: '117.89', change: 4.22, changePercent: 2.43 },
  { symbol: 'TSLA', name: 'Tsla', price: '177.89', change: 4.22, changePercent: 2.43 },
  { symbol: 'NVDA', name: 'Nvidia', price: '38.52', change: 1.06, changePercent: 2.83 },
])
</script>

<style scoped>
.stock-ticker {
  width: 100%;
  background: rgba(2, 58, 98, 0.2);
  border-radius: 20px;
  padding: 24px;
  margin-bottom: var(--spacing-3xl);
  overflow: hidden;
}

.ticker-container {
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  gap: 24px;
  position: relative;
}

.stock-card {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 20px 24px;
  gap: 8px;
  min-width: 173px;
  background: var(--color-background);
  border-radius: 16px;
  flex-shrink: 0;
}

.stock-header {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 8px;
}

.company-icon {
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-primary);
  border-radius: 4px;
}

.icon-text {
  font-size: 12px;
  color: var(--color-text);
  font-weight: var(--font-weight-bold);
}

.company-name {
  font-family: var(--font-family-secondary);
  font-weight: 500;
  font-size: 20px;
  line-height: 24px;
  color: var(--color-text);
}

.stock-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
  width: 100%;
}

.stock-label {
  font-family: var(--font-family-secondary);
  font-weight: 400;
  font-size: 12px;
  line-height: 14px;
  color: var(--color-text);
}

.stock-price-row {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 4px;
}

.stock-price {
  font-family: var(--font-family-secondary);
  font-weight: 500;
  font-size: 24px;
  line-height: 28px;
  color: var(--color-text);
}

.stock-changes {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0;
}

.price-change,
.percent-change {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 2px;
}

.change-value,
.percent-value {
  font-family: var(--font-family-secondary);
  font-weight: 500;
  font-size: 13px;
  line-height: 15px;
  color: #3ba752;
}

.price-change.negative .change-value,
.percent-change.negative .percent-value {
  color: #c41c1c;
}

.arrow-icon {
  font-size: 16px;
  color: #3ba752;
}

.price-change.negative .arrow-icon {
  color: #c41c1c;
  transform: rotate(180deg);
}

.percent-icon {
  font-size: 12px;
  color: #3ba752;
}

.stock-unit {
  font-family: var(--font-family-secondary);
  font-weight: 400;
  font-size: 8px;
  line-height: 9px;
  color: var(--color-text);
}

.scroll-button {
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 32px;
  height: 32px;
  background: #39daff;
  border-radius: 50%;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.05);
}

.scroll-button .arrow-icon {
  color: var(--color-background);
  font-size: 18px;
  font-weight: bold;
}

/* Responsive */
@media (max-width: 1280px) {
  .ticker-container {
    overflow-x: auto;
    padding-bottom: 8px;
  }
}
</style>
