function parallaxMouse(options) {
  /**
	 * Setting options
	 */
  const elements = options.elements instanceof HTMLElement
    ? [options.elements]
    : document.querySelectorAll(options.elements)

  if (!elements.length) {
    console.warn('parallaxMouse: Elements is empty!')
    return
  }

  const moveFactor = options.moveFactor ?? 5
  const wrap = options.wrap instanceof HTMLElement
    ? options.wrap
    : document.querySelector(options.wrap ?? '.container')

  if (!wrap) {
    console.warn('parallaxMouse: Wrap element not found!')
    return
  }
  const perspective = options.perspective ?? false

  /**
	 * Set 'preserve-3d' for perspective objects
	 */
  elements.forEach((element) => {
    if (perspective) {
      element.style.transformStyle = 'preserve-3d'
    }
    element.addEventListener('mousemove', function (e) {
      // Получаем координаты элемента относительно окна
      const rect = element.getBoundingClientRect()

      // Координаты мыши относительно центра элемента
      const mouseX = e.clientX - (rect.left + rect.width / 2)
      const mouseY = e.clientY - (rect.top + rect.height / 2)

      // Вычисляем процентное смещение на основе размеров элемента
      let percentX = -(mouseX / (rect.width / 2)) * moveFactor
      let percentY = -(mouseY / (rect.height / 2)) * moveFactor

      element.style.transform = `translate(${percentX}%, ${percentY}%)`

      if (perspective) {
        // Добавляем 3D-повороты на основе смещения мыши
        let rotateX = (mouseY / rect.height) * -30 // Поворот по оси X
        let rotateY = (mouseX / rect.width) * 30 // Поворот по оси Y

        element.style.transform += ` rotateX(${rotateX}deg) rotateY(${rotateY}deg) perspective(${perspective})`
      }
    })
  })

  // wrap.addEventListener('mousemove', function (e) {
  //   let percentX = (0 - ((e.pageX / window.innerWidth) * moveFactor) - (moveFactor / 2) + moveFactor) / 2
  //   let percentY = (0 - ((e.pageY / window.innerHeight) * moveFactor) - (moveFactor / 2) + moveFactor) / 2

  //   elements.forEach((element) => {
  //     element.style.transform = `translate(${percentX}%, ${percentY}%)`

  //     if (perspective) {
  //       let mouseX = (e.pageX - window.pageYOffset - window.innerWidth / 2) / window.innerWidth
  //       let mouseY = (e.pageY - window.pageXOffset - window.innerHeight / 2) / window.innerWidth

  //       element.style.transform += `rotateX(${mouseX * 30}deg) rotateY(${mouseY * -30}deg) perspective(${perspective})`
  //     }
  //   })
  // })
}

window.parallaxMouse = parallaxMouse

export { parallaxMouse }
