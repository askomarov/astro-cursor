import gsap from 'gsap'
import MouseFollower from 'mouse-follower'
import Lenis from 'lenis'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { initModals } from './modules/modals/init-modals'
import { mobileVhFix } from './utils/mobile-vh-fix'
import { initSlider } from './modules/init-slider'
import { parallaxMouse } from './utils/parallax-mouse'
import { initBurgerMenu } from './modules/init-burger-menu'

gsap.registerPlugin(ScrollTrigger)

const lenis = new Lenis()

lenis.on('scroll', ScrollTrigger.update)

gsap.ticker.add((time) => {
  lenis.raf(time * 1000)
})

gsap.ticker.lagSmoothing(0)

mobileVhFix()
document.addEventListener(
  'DOMContentLoaded',
  () => {
    initSlider()
    // все скрипты должны быть в обработчике 'DOMContentLoaded', но не все в 'load'
    // в load следует добавить скрипты, не участвующие в работе первого экрана
    window.addEventListener('load', () => {
      initModals()
      initBurgerMenu()
      MouseFollower.registerGSAP(gsap)

      const cursor = new MouseFollower()

      const cursorInverseEl = document.querySelectorAll('[data-cursor-inverse]')
      if (cursorInverseEl.length) {
        cursorInverseEl.forEach((el) => {
          el.addEventListener('mouseenter', () => {
            cursor.addState('-inverse')
          })
          el.addEventListener('mouseleave', () => {
            cursor.removeState('-inverse')
          })
        })
      }

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
      }

      const elCurImage = document.querySelector('[data-cursor-smile]')
      if (elCurImage) {
        elCurImage.addEventListener('mouseenter', () => {
          cursor.setImg('/img/smiling-eyes.png')
          cursor.setSkewing(2)
        })

        elCurImage.addEventListener('mouseleave', () => {
          cursor.removeImg()
          cursor.removeSkewing()
        })
      }

      //
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
    })
  },
  true
)
