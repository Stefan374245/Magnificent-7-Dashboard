# Magnificent 7 Dashboard - Design Tokens Übersicht

Automatisch extrahiert aus Figma am: ${new Date().toLocaleDateString('de-DE')}

## 🎨 Farbpalette

### Primärfarben

- **Primary (Rot)**: `#fd5b4f` → `var(--color-primary)`
- **Background (Dunkelblau)**: `#011f35` → `var(--color-background)`
- **Background Dark**: `#124658` → `var(--color-background-dark)`
- **Text (Weiß)**: `#ffffff` → `var(--color-text)`

### Chart-Farben (Magnificent 7 Unternehmen)

1. **Meta**: `#39daff` → `var(--color-chart-1)` (hellstes Blau)
2. **Tesla**: `#31bfe2` → `var(--color-chart-2)`
3. **Nvidia**: `#29a5c5` → `var(--color-chart-3)`
4. **Microsoft**: `#218aa8` → `var(--color-chart-4)`
5. **Apple**: `#196f8c` → `var(--color-chart-5)`
6. **Google**: `#11546f` → `var(--color-chart-6)`
7. **Amazon**: `#093a52` → `var(--color-chart-7)` (dunkelstes Blau)

## 📏 Abstände (Spacing)

```css
--spacing-xs: 4px --spacing-sm: 8px --spacing-md: 16px --spacing-lg: 24px --spacing-xl: 32px
  --spacing-2xl: 40px --spacing-3xl: 60px --spacing-4xl: 88px;
```

## 🔤 Typografie

### Font-Familien

- **Primär (Headlines)**: Figtree → `var(--font-family-primary)`
- **Sekundär (Body)**: Rubik → `var(--font-family-secondary)`

### Font-Größen

```css
--font-size-xs: 8px (Labels, kleine Texte) --font-size-sm: 10px (Chart-Labels)
  --font-size-base: 12px (Standard-Text) --font-size-md: 13px (Preise, Änderungen)
  --font-size-lg: 20px (Überschriften) --font-size-xl: 24px (Große Zahlen) --font-size-2xl: 36px
  (Große Überschriften) --font-size-3xl: 48px (Hero-Text) --font-size-4xl: 64px (Extra groß)
  --font-size-5xl: 96px (Dashboard-Titel);
```

### Font-Weights

```css
--font-weight-normal: 400 (Normal) --font-weight-medium: 500 (Medium) --font-weight-semibold: 600
  (Semi-Bold) --font-weight-bold: 800 (Bold);
```

## 📐 Layout-Struktur

### Dashboard

- **Breite**: 1440px
- **Höhe**: 1122px
- **Layout**: Frei positioniert
- **Kinder**: 4 Hauptbereiche

### Chart-Container (z.B. Revenue Last 3 Years)

- **Breite**: 714px
- **Höhe**: 352px
- **Layout**: Vertikal (VERTICAL)
- **Padding**: 32px (links/rechts), 20px (oben/unten)
- **Gap**: 20px zwischen Elementen
- **Border-Radius**: 16px
- **Hintergrund**: `#011f35`

### Pie-Chart-Container (Revenue Breakdown)

- **Breite**: 494px
- **Höhe**: 352px
- **Layout**: Vertikal (VERTICAL)
- **Padding**: 32px (links/rechts), 20px (oben/unten)
- **Gap**: 20px zwischen Elementen
- **Border-Radius**: 16px

## 🧩 Verwendungsbeispiele

### Vue Component mit Design Tokens

```vue
<template>
  <div class="chart-card">
    <h2 class="chart-title">Revenue Last 3 Years</h2>
    <div class="chart-content">
      <!-- Chart hier -->
    </div>
  </div>
</template>

<style scoped>
/* Die CSS-Variablen sind bereits verfügbar */
.chart-card {
  background-color: var(--color-background);
  border-radius: var(--border-radius-md);
  padding: var(--spacing-xl) var(--spacing-xl) var(--spacing-lg) var(--spacing-xl);
}

.chart-title {
  color: var(--color-text);
  font-family: var(--font-family-secondary);
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
}
</style>
```

### Utility Classes

```vue
<div class="flex flex-col gap-md bg-dark rounded-md p-card">
  <h1 class="font-primary font-bold text-white">Dashboard</h1>
  <p class="font-secondary">Magnificent 7 Companies</p>
</div>
```

## 📦 Verfügbare Dateien

1. **`tokens.json`** - Alle extrahierten Rohdaten aus Figma
2. **`design-tokens.css`** - Alle CSS-Variablen (automatisch generiert)
3. **`theme.css`** - Bereinigte, semantische CSS-Variablen + Utility Classes

## 🚀 Nächste Schritte

1. ✅ Design Tokens extrahiert
2. ✅ Theme CSS erstellt
3. ✅ In main.ts importiert
4. 🔄 Vue-Komponenten erstellen (Dashboard, Charts)
5. 🔄 Daten-Integration (API oder Mock-Daten)
6. 🔄 Responsive Design anpassen
