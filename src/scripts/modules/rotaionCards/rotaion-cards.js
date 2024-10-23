
const initRotationCards = () => {
  const panelList = document.querySelectorAll('[data-panel-item="front"]')

  const onMouseOver = (t) => {
    t.preventDefault()
    t.stopPropagation()
    const e = t.currentTarget.parentElement
    if (!e || e.getAttribute('data-hover') === 'true') {
      return
    }

    e.setAttribute('data-hover', 'true')

    setTimeout((() => {
      e.setAttribute('data-hover', 'false')
    }
    ), 1100)
  }

  panelList?.forEach((t) => {
    t.addEventListener('mouseover', onMouseOver)
  })
}

export { initRotationCards }
