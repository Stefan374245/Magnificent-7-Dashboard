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

    // Extrahiere Icons und Bilder
    console.log('\n🔍 Suche nach Icons und Bildern...')
    const imageNodes = extractImageNodes(data.document)
    
    if (imageNodes.length > 0) {
      console.log(`   - ${imageNodes.length} Icons/Bilder gefunden`)
      await downloadImages(imageNodes)
    } else {
      console.log('   - Keine Icons oder Bilder gefunden')
    }
  } catch (err) {
    console.error('Fehler:', err)
  }
}

function extractImageNodes(node, out = [], parentName = '') {
  const name = node.name?.toLowerCase() || ''
  const width = node.absoluteBoundingBox?.width || 0
  const height = node.absoluteBoundingBox?.height || 0
  
  // Suche nach Komponenten die als Icons gelten könnten
  if (node.type === 'COMPONENT' || node.type === 'INSTANCE') {
    // Prüfe ob es ein Icon ist
    if (
      name.includes('icon') ||
      name.includes('logo') ||
      name.includes('symbol') ||
      (width < 200 && height < 200)
    ) {
      out.push({
        id: node.id,
        name: node.name,
        type: node.type,
        width,
        height,
      })
    }
  }

  // Suche nach Vector-Elementen (SVG-Icons)
  if (node.type === 'VECTOR' || node.type === 'BOOLEAN_OPERATION' || node.type === 'STAR' || node.type === 'ELLIPSE') {
    // Nimm Vector nur, wenn er klein genug ist (wahrscheinlich ein Icon)
    // und einen sinnvollen Namen hat (nicht nur "Vector")
    const isSmallEnough = width < 150 && height < 150
    const hasGoodName = name !== 'vector' || parentName.includes('icon') || parentName.includes('logo')
    
    if (isSmallEnough && hasGoodName) {
      // Verwende den Parent-Namen wenn der Vector selbst nur "Vector" heißt
      const displayName = name === 'vector' && parentName ? parentName : node.name
      
      out.push({
        id: node.id,
        name: displayName,
        type: 'VECTOR',
        width,
        height,
      })
    }
  }

  // Suche nach Frames die Icons enthalten könnten
  if (node.type === 'FRAME' && (name.includes('icon') || name.includes('logo'))) {
    out.push({
      id: node.id,
      name: node.name,
      type: 'FRAME',
      width,
      height,
    })
  }

  // Suche nach Bildern (RECTANGLE mit Image-Fill oder IMAGE Nodes)
  if (node.type === 'RECTANGLE' || node.type === 'IMAGE') {
    if (node.fills && Array.isArray(node.fills)) {
      const hasImageFill = node.fills.some((fill) => fill.type === 'IMAGE')
      if (hasImageFill) {
        out.push({
          id: node.id,
          name: node.name || 'image',
          type: 'IMAGE',
          width,
          height,
        })
      }
    }
  }

  if (node.children && Array.isArray(node.children)) {
    node.children.forEach((child) => extractImageNodes(child, out, node.name))
  }

  return out
}

async function downloadImages(imageNodes) {
  try {
    // Erstelle Verzeichnisse
    const iconsDir = path.join(__dirname, '../assets/icons')
    const imagesDir = path.join(__dirname, '../assets/images')
    
    if (!fs.existsSync(iconsDir)) fs.mkdirSync(iconsDir, { recursive: true })
    if (!fs.existsSync(imagesDir)) fs.mkdirSync(imagesDir, { recursive: true })

    // Hole Bild-URLs von Figma API (max 100 pro Request)
    const nodeIds = imageNodes.map((n) => n.id).join(',')
    
    // Exportiere als SVG für Icons, PNG für Bilder
    const formats = ['svg', 'png']
    
    for (const format of formats) {
      const scale = format === 'png' ? 2 : 1 // 2x für PNG (Retina)
      const imageRes = await fetch(
        `https://api.figma.com/v1/images/${FILE_KEY}?ids=${nodeIds}&format=${format}&scale=${scale}`,
        {
          headers: { 'X-Figma-Token': TOKEN },
        },
      )

      if (!imageRes.ok) {
        console.error(`Fehler beim Abrufen der ${format.toUpperCase()}-URLs:`, imageRes.status)
        continue
      }

      const imageData = await imageRes.json()

      if (imageData.err) {
        console.error(`Fehler von Figma API:`, imageData.err)
        continue
      }

      // Lade jedes Bild herunter
      let downloadedCount = 0
      for (const node of imageNodes) {
        const url = imageData.images[node.id]
        if (!url) {
          console.warn(`Keine URL für ${node.name} (${node.id})`)
          continue
        }

        try {
          const imgRes = await fetch(url)
          if (!imgRes.ok) {
            console.warn(`Fehler beim Laden von ${node.name}:`, imgRes.status)
            continue
          }

          const buffer = await imgRes.buffer()
          
          // Bestimme Zielverzeichnis
          const isIcon =
            node.name.toLowerCase().includes('icon') ||
            node.name.toLowerCase().includes('logo') ||
            (node.width < 100 && node.height < 100)
          
          const targetDir = isIcon ? iconsDir : imagesDir
          
          // Erstelle sauberen Dateinamen
          const cleanName = node.name
            .replace(/[^a-z0-9-_]/gi, '-')
            .replace(/-+/g, '-')
            .toLowerCase()
          
          const filename = `${cleanName}.${format}`
          const filepath = path.join(targetDir, filename)
          
          fs.writeFileSync(filepath, buffer)
          downloadedCount++
          
          // Zeige nur SVGs oder erste paar PNGs an
          if (format === 'svg' || downloadedCount <= 3) {
            console.log(`   ✓ ${filename} (${format.toUpperCase()})`)
          }
        } catch (err) {
          console.warn(`Fehler beim Speichern von ${node.name}:`, err.message)
        }
      }
      
      if (downloadedCount > 3 && format === 'png') {
        console.log(`   ✓ ... und ${downloadedCount - 3} weitere ${format.toUpperCase()}-Dateien`)
      }
      
      console.log(`✅ ${downloadedCount} ${format.toUpperCase()}-Dateien heruntergeladen\n`)
    }
  } catch (err) {
    console.error('Fehler beim Herunterladen der Bilder:', err)
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
