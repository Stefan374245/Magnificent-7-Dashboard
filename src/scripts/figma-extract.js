// src/scripts/figma-extract.js
// npm install node-fetch@2
import fetch from 'node-fetch'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const TOKEN = process.env.FIGMA_TOKEN
const FILE_KEY = process.env.FIGMA_FILE_KEY

if (!TOKEN || !FILE_KEY) {
  console.error('Bitte FIGMA_TOKEN und FIGMA_FILE_KEY als Umgebungsvariable setzen.')
  process.exit(1)
}

async function run() {
  try {
    const res = await fetch(`https://api.figma.com/v1/files/${FILE_KEY}`, {
      headers: { 'X-Figma-Token': TOKEN },
    })

    if (!res.ok) {
      console.error('Fehler beim Zugriff auf Figma:', res.status, await res.text())
      process.exit(1)
    }

    const data = await res.json()

    // Extrahiere alle Design-Tokens
    const colors = extractColors(data.document)
    const typography = extractTypography(data.document)
    const spacing = extractSpacing(data.document)
    const layout = extractLayout(data.document)
    const components = extractComponents(data.document)

    const outputDir = path.join(__dirname, '../assets/design-tokens')
    if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true })

    // Speichere alle Tokens
    const tokens = {
      colors,
      typography,
      spacing,
      layout,
      components,
    }

    fs.writeFileSync(path.join(outputDir, 'tokens.json'), JSON.stringify(tokens, null, 2))

    // Erstelle CSS-Datei mit allen Variablen
    const css = generateCSS(tokens)
    fs.writeFileSync(path.join(outputDir, 'design-tokens.css'), css)

    console.log('✅ tokens.json und design-tokens.css wurden erstellt.')
    console.log(`   - ${Object.keys(colors).length} Farben`)
    console.log(`   - ${typography.length} Textstile`)
    console.log(`   - ${spacing.length} Abstände`)
    console.log(`   - ${layout.length} Layouts`)
    console.log(`   - ${components.length} Komponenten`)
  } catch (err) {
    console.error('Fehler:', err)
  }
}

function extractColors(node, out = {}) {
  if (node.fills && Array.isArray(node.fills)) {
    node.fills.forEach((f) => {
      if (f.type === 'SOLID' && f.color) {
        const r = Math.round(f.color.r * 255)
        const g = Math.round(f.color.g * 255)
        const b = Math.round(f.color.b * 255)
        const hex = '#' + [r, g, b].map((x) => x.toString(16).padStart(2, '0')).join('')
        const name = (node.name || 'unnamed').replace(/\s+/g, '-').toLowerCase()
        out[`${name}_${hex.replace('#', '')}`] = hex
      }
    })
  }
  if (node.children && Array.isArray(node.children)) {
    node.children.forEach((child) => extractColors(child, out))
  }
  return out
}

function extractTypography(node, out = []) {
  if (node.type === 'TEXT' && node.style) {
    const textStyle = {
      name: node.name,
      fontFamily: node.style.fontFamily || 'Inter',
      fontSize: node.style.fontSize || 16,
      fontWeight: node.style.fontWeight || 400,
      lineHeight: node.style.lineHeightPx || node.style.fontSize || 16,
      letterSpacing: node.style.letterSpacing || 0,
      textAlign: node.style.textAlignHorizontal || 'LEFT',
    }

    const exists = out.find(
      (t) => t.fontSize === textStyle.fontSize && t.fontWeight === textStyle.fontWeight,
    )

    if (!exists) {
      out.push(textStyle)
    }
  }

  if (node.children && Array.isArray(node.children)) {
    node.children.forEach((child) => extractTypography(child, out))
  }
  return out
}

function extractSpacing(node, out = new Set()) {
  // Extrahiere Padding
  if (node.paddingLeft) out.add(node.paddingLeft)
  if (node.paddingRight) out.add(node.paddingRight)
  if (node.paddingTop) out.add(node.paddingTop)
  if (node.paddingBottom) out.add(node.paddingBottom)

  // Extrahiere Abstände zwischen Elementen
  if (node.itemSpacing) out.add(node.itemSpacing)

  // Extrahiere Layout-Grid Spacing
  if (node.layoutGrids && Array.isArray(node.layoutGrids)) {
    node.layoutGrids.forEach((grid) => {
      if (grid.offset) out.add(grid.offset)
      if (grid.gutterSize) out.add(grid.gutterSize)
    })
  }

  if (node.children && Array.isArray(node.children)) {
    node.children.forEach((child) => extractSpacing(child, out))
  }

  return Array.from(out).sort((a, b) => a - b)
}

function extractLayout(node, out = []) {
  // Extrahiere Frame/Container Informationen
  if ((node.type === 'FRAME' || node.type === 'COMPONENT') && node.name) {
    const layout = {
      name: node.name,
      type: node.type,
      width: node.absoluteBoundingBox?.width || 0,
      height: node.absoluteBoundingBox?.height || 0,
      layoutMode: node.layoutMode || 'NONE', // HORIZONTAL, VERTICAL, NONE
      primaryAxisSizingMode: node.primaryAxisSizingMode || 'AUTO',
      counterAxisSizingMode: node.counterAxisSizingMode || 'AUTO',
      paddingLeft: node.paddingLeft || 0,
      paddingRight: node.paddingRight || 0,
      paddingTop: node.paddingTop || 0,
      paddingBottom: node.paddingBottom || 0,
      itemSpacing: node.itemSpacing || 0,
      cornerRadius: node.cornerRadius || 0,
      childCount: node.children?.length || 0,
    }

    // Filtere nur interessante Layouts (nicht zu klein, hat Kinder)
    if (layout.width > 100 && layout.childCount > 0) {
      out.push(layout)
    }
  }

  if (node.children && Array.isArray(node.children)) {
    node.children.forEach((child) => extractLayout(child, out))
  }

  return out
}

function extractComponents(node, out = []) {
  // Extrahiere Komponenten und deren Struktur
  if (node.type === 'COMPONENT' || node.type === 'INSTANCE') {
    const component = {
      name: node.name,
      type: node.type,
      width: node.absoluteBoundingBox?.width || 0,
      height: node.absoluteBoundingBox?.height || 0,
      description: node.description || '',
      properties: {},
    }

    // Extrahiere Hintergrundfarbe
    if (node.fills && node.fills[0]?.color) {
      const c = node.fills[0].color
      component.properties.backgroundColor = `#${[c.r, c.g, c.b]
        .map((x) =>
          Math.round(x * 255)
            .toString(16)
            .padStart(2, '0'),
        )
        .join('')}`
    }

    // Extrahiere Layout-Eigenschaften
    if (node.layoutMode) {
      component.properties.layout = node.layoutMode
      component.properties.padding = {
        top: node.paddingTop || 0,
        right: node.paddingRight || 0,
        bottom: node.paddingBottom || 0,
        left: node.paddingLeft || 0,
      }
      component.properties.gap = node.itemSpacing || 0
    }

    if (node.cornerRadius) {
      component.properties.borderRadius = node.cornerRadius
    }

    out.push(component)
  }

  if (node.children && Array.isArray(node.children)) {
    node.children.forEach((child) => extractComponents(child, out))
  }

  return out
}

function generateCSS(tokens) {
  let css = ':root {\n'

  // Farben
  css += '  /* Farben */\n'
  Object.entries(tokens.colors).forEach(([k, v]) => {
    css += `  --color-${k}: ${v};\n`
  })

  // Abstände
  css += '\n  /* Abstände */\n'
  tokens.spacing.forEach((space, i) => {
    css += `  --spacing-${i}: ${space}px;\n`
  })

  // Typografie
  css += '\n  /* Typografie */\n'
  tokens.typography.forEach((style, i) => {
    const name = style.name.replace(/\s+/g, '-').toLowerCase()
    css += `  --font-size-${name}: ${style.fontSize}px;\n`
    css += `  --font-weight-${name}: ${style.fontWeight};\n`
    css += `  --line-height-${name}: ${style.lineHeight}px;\n`
  })

  css += '}\n'
  return css
}

run()
