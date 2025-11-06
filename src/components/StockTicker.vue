<template>
  <div class="stock-ticker">
    <div class="ticker-container">
      <div v-for="stock in stocks" :key="stock.symbol" class="stock-card">
        <div class="stock-header">
          <div class="company-icon">
            <img
              v-if="stock.logo"
              :src="stock.logo"
              :alt="stock.name"
              class="company-logo"
            />
            <span v-else class="icon-text">{{ stock.symbol.charAt(0) }}</span>
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
                <IconWrapper
                  :name="stock.change > 0 ? 'arrow_upward_alt' : 'arrow_upward_alt'"
                  :width="14"
                  :height="14"
                  :class="{ 'arrow-down': stock.change < 0 }"
                />
              </div>

              <div class="percent-change" :class="{ negative: stock.changePercent < 0 }">
                <span class="percent-value">{{ stock.changePercent }}%</span>
                <IconWrapper name="percent" :width="12" :height="12" />
              </div>
            </div>
          </div>

          <div class="stock-unit">In Bill USD</div>
        </div>
      </div>

      <button class="scroll-button">
        <IconWrapper name="icon" :width="16" :height="16" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import IconWrapper from './icons/IconWrapper.vue'

interface Stock {
  symbol: string
  name: string
  price: string
  change: number
  changePercent: number
  logo?: string
}

// Importiere die Logos
const getLogoUrl = (logoName: string) => {
  try {
    return new URL(`../assets/icons/${logoName}.svg`, import.meta.url).href
  } catch {
    return undefined
  }
}

const stocks = ref<Stock[]>([
  {
    symbol: 'AAPL',
    name: 'Apple',
    price: '38.52',
    change: 1.06,
    changePercent: 2.83,
    logo: getLogoUrl('logo0'),
  },
  {
    symbol: 'META',
    name: 'Meta',
    price: '435.57',
    change: -5.81,
    changePercent: -1.32,
    logo: getLogoUrl('logo1'),
  },
  {
    symbol: 'MSFT',
    name: 'Microsoft',
    price: '409.05',
    change: 1.7,
    changePercent: 2.51,
    logo: getLogoUrl('logo2'),
  },
  {
    symbol: 'GOOGL',
    name: 'Google',
    price: '29.87',
    change: 1.7,
    changePercent: 6.04,
    logo: getLogoUrl('logo0'),
  },
  {
    symbol: 'AMZN',
    name: 'Amazon',
    price: '117.89',
    change: 4.22,
    changePercent: 2.43,
    logo: getLogoUrl('logo1'),
  },
  {
    symbol: 'TSLA',
    name: 'Tsla',
    price: '177.89',
    change: 4.22,
    changePercent: 2.43,
    logo: getLogoUrl('logo2'),
  },
  {
    symbol: 'NVDA',
    name: 'Nvidia',
    price: '38.52',
    change: 1.06,
    changePercent: 2.83,
    logo: getLogoUrl('logo0'),
  },
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

.company-logo {
  width: 100%;
  height: 100%;
  object-fit: contain;
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

.arrow-down {
  transform: rotate(180deg);
}

.price-change :deep(.icon),
.percent-change :deep(.icon) {
  filter: brightness(0) saturate(100%) invert(59%) sepia(31%) saturate(1347%) hue-rotate(86deg);
}

.price-change.negative :deep(.icon) {
  filter: brightness(0) saturate(100%) invert(23%) sepia(85%) saturate(4051%) hue-rotate(351deg);
}

.percent-change.negative :deep(.icon) {
  filter: brightness(0) saturate(100%) invert(23%) sepia(85%) saturate(4051%) hue-rotate(351deg);
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

.scroll-button :deep(.icon) {
  filter: brightness(0) saturate(100%) invert(4%) sepia(18%) saturate(3907%) hue-rotate(174deg);
}

/* Responsive */
@media (max-width: 1280px) {
  .ticker-container {
    overflow-x: auto;
    padding-bottom: 8px;
  }
}
</style>
