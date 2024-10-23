import gsap from 'gsap'
import { getMousePos, getWinSize, isFirefox } from '../../utils/utils'

// Initialize mouse position object
let mousepos = { x: 0, y: 0 }

// Update 'mousepos' with the current mouse position
const updateMousePos = (ev) => {
  mousepos = getMousePos(ev)
}

// Listen for 'mousemove' and 'pointermove' events and update 'mousepos' accordingly
window.addEventListener('mousemove', updateMousePos)
window.addEventListener('pointermove', updateMousePos, { passive: true })

// Initialize window size object
let winsize = getWinSize()

// Recalculate window size on 'resize' event
window.addEventListener('resize', () => {
  winsize = getWinSize()
})

// Class representing the Goo cursor
export class GooCursor {
  // Initialize DOM and style related properties
  DOM = {
    // Main DOM element
    el: null,
    // .cursor__inner element
    inner: null,
    // cells that get shown on mousemove
    cells: null
  }
  cellSize
  // Number of cell rows
  rows
  // Number of cell columns
  columns
  // Settings
  settings = {
    // Time that one cells gets visible before fading out
    ttl: 0.5
  }

  constructor(options) {
    this.DOM.el = document.querySelector(options.parent)

    // Cells wrapper element that gets the SVG filter applied
    this.DOM.inner = this.DOM.el.querySelector(options.innerClass)

    // Too much for firefox...
    if (!isFirefox()) {
      this.DOM.inner.style.filter = 'url(#gooey)'
    }

    // ttl from data attr
    this.settings.ttl =
      this.DOM.el.getAttribute('data-ttl') || this.settings.ttl

    this.layout()
    // Initialize/Bind some events
    this.initEvents()
  }

  /**
   * Initialize/bind events
   */
  initEvents() {
    window.addEventListener('resize', () => this.layout())

    // Show/hide cells on 'mousemove' or 'pointermove' events
    const handleMove = () => {
      // Check which cell is being "hovered"
      const cell = this.getCellAtCursor()

      if (cell === null || this.cachedCell === cell) return
      // Cache it
      this.cachedCell = cell
      // Set opacity to 1
      gsap.set(cell, { opacity: 1 })
      // Set it back to 0 after a certain delay
      gsap.set(cell, { opacity: 0, delay: this.settings.ttl })
      // gsap.to(cell, { duration: 0.3, ease: 'expo', opacity: 0, delay: this.settings.ttl });
    }

    window.addEventListener('mousemove', handleMove)
    window.addEventListener('pointermove', handleMove, { passive: true })
  }

  layout() {
    // The number of columns is defined in a CSS variable --columns
    this.columns = getComputedStyle(this.DOM.el).getPropertyValue('--columns')
    // Calculate cell size
    this.cellSize = winsize.width / this.columns
    // Calculate number of rows
    this.rows = Math.ceil(winsize.height / this.cellSize)
    // Calculate the total amount of cells (rows x columns)
    this.cellsTotal = this.rows * this.columns
    let innerStr = ''
    // Erase contents
    this.DOM.inner.innerHTML = ''

    const customColorsAttr = this.DOM.el.getAttribute('data-custom-colors')
    let customColorsArr
    let customColorsTotal = 0
    if (customColorsAttr) {
      customColorsArr = this.DOM.el
        .getAttribute('data-custom-colors')
        .split(',')
      customColorsTotal = customColorsArr ? customColorsArr.length : 0
    }
    for (let i = 0; i < this.cellsTotal; ++i) {
      innerStr +=
        customColorsTotal === 0
          ? '<div class="square-effect__square"></div>'
          : `<div style="transform: scale(${gsap.utils.random(0.5, 2)}); background:${customColorsArr[Math.round(gsap.utils.random(0, customColorsTotal - 1))]}" class="square-effect__square"></div>`
    }
    this.DOM.inner.innerHTML = innerStr
    this.DOM.cells = this.DOM.inner.children
  }

  getCellAtCursor() {
    const columnIndex = Math.floor(mousepos.x / this.cellSize)
    const rowIndex = Math.floor(mousepos.y / this.cellSize)
    const cellIndex = rowIndex * this.columns + columnIndex

    if (cellIndex >= this.cellsTotal || cellIndex < 0) {
      return null
    }

    return this.DOM.cells[cellIndex]
  }
}
