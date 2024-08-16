# Проект на Astro
Использован шаблон [astro-template](https://github.com/askomarov/astro-template)

## Кастомный курсор
![preview image](preview.gif)
Для интерактивного курсора исользуется библиотека
[mouse-follower](https://github.com/Cuberto/mouse-follower)
Работает вместе с Gsap.

```js
import MouseFollower from 'mouse-follower'
import gsap from 'gsap'

MouseFollower.registerGSAP(gsap)

const cursor = new MouseFollower()
```

По ссылке на документацию, найдете всё не обходимое.

Стили для курсора лежат
`src/styles/components/cursor.scss`

Необходимый js для движения элемента во время эффекта прилипания.
`src/scripts/utils/parallax-mouse.js`

Эффект показа media - видео

```js
      const elVideo = document.querySelector('[data-cursor-video]')
      if (elVideo) {
        elVideo.addEventListener('mouseenter', () => {
          cursor.addState('-media--lg')
          cursor.addState('-media')
          cursor.setVideo('//cdn.cuberto.com/cb/projects/flipaclip/cover.mp4')
        })

        elVideo.addEventListener('mouseleave', () => {
          cursor.removeVideo()
          cursor.removeState('-media')
          cursor.removeState('-media--lg')
        })
      }`
```

В этот примере я добавил пару эффектов.
Эффект прилипания и движения элемента, лучше когда это кнопка без фона, а просто

```js
const btnWithStick = document.querySelectorAll('[button-stuck]')
if (btnWithStick.length) {
  btnWithStick.forEach((btn) => {
    parallaxMouse({
      elements: btn,
      moveFactor: 100,
      wrap: btn
    })
    btn.addEventListener('mouseenter', () => {
      cursor.setStick(btn)
      cursor.setSkewing(2)
      cursor.addState('-stuck')
    })

    btn.addEventListener('mouseleave', () => {
      cursor.removeStick()
      cursor.removeState('-stuck')
      cursor.removeSkewing()
      btn.setAttribute('style', '')
    })
  })
}
```
