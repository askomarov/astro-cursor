import gsap from 'gsap'
import MouseFollower from 'mouse-follower'
import Lenis from 'lenis'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { initModals } from './modules/modals/init-modals'
import { mobileVhFix } from './utils/mobile-vh-fix'
import { initSlider } from './modules/init-slider'
import { parallaxMouse } from './utils/parallax-mouse'
import { initBurgerMenu } from './modules/init-burger-menu'
import { GooCursor } from './modules/gooeyCursorCell/gooey-cursor-cell'
// import { initRotationCards } from './modules/rotaionCards/rotaion-cards'

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
    lenis.scrollTo('top')

    initSlider()
    initBurgerMenu()
    // все скрипты должны быть в обработчике 'DOMContentLoaded', но не все в 'load'
    // в load следует добавить скрипты, не участвующие в работе первого экрана
    new GooCursor({ parent: '.square-effect', innerClass: '.square-effect__items' })
    window.addEventListener('load', () => {
      lenis.scrollTo('top')
      initModals()
      // initRotationCards()
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
            moveFactor: 10,
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

      // animation for .rotation-cards
      const rotationCardsWrap = document.querySelector('.rotation-cards')
      const rTl = gsap.timeline({
        scrollTrigger: {
          trigger: '.rotation-wrap__inner',
          start: 'top top',
          end: () => '+=' + 0.3 * window.innerHeight,
          scrub: true,
          toggleClass: 'is-fixed',
          anticipatePin: 1,
          markers: false,
          pin: true,
        }
      })
      rTl.from('.section-next', {
        opacity: 0,
        // yPercent: 30
      })
      let isLocked

      // const body = document.querySelector('body')
      const rotationWrap = document.querySelector('.rotation-wrap')
      const scrollLock = () => {
        lenis.isStopped = true
        isLocked = true
        // body.style.overflowY = 'hidden'
        rotationWrap.style.backgroundColor = '#111111'
      }
      const scrollUnlock = () => {
        lenis.isStopped = false
        isLocked = false
        // body.style.overflowY = 'auto'
        setTimeout(() => {
          rotationWrap.style.backgroundColor = '#ff00ff'
        }, 500)
      }
      const cards = gsap.utils.toArray('.roation-card')
      const cardsInner = gsap.utils.toArray('.roation-card__inner')
      const shufledcards = gsap.utils.shuffle(cards)
      const rotateAllCards = (deg) => {
        gsap.to(shufledcards, {
          duration: 0.3,
          rotationX: deg,
          stagger: 0.01,
          ease: 'power1.in',
        })
      }


      scrollLock()
      // add event listeners on mousewheel,  if scroll down - unlock scroll
      window.addEventListener('wheel', (e) => {
        // console.log(e.deltaY)
        // console.log(lenis.direction)

        if (e.deltaY > 20) {
          rotateAllCards(180)
          gsap.to(cardsInner, {
            borderRadius: '0',
            duration: 1,
            delay: 0.3
          })
          gsap.to(rotationCardsWrap, {
            gap: 0,
            duration: 1,
            delay: 0.3
          })
          setTimeout(() => {
            scrollUnlock()
          }, 300)
        }
      })
      window.addEventListener('scroll', () =>{
        if (lenis.actualScroll === 0 && !isLocked) {
          scrollLock()
          gsap.to(cardsInner, {
            borderRadius: '6px',
          })
          gsap.to(rotationCardsWrap, {
            gap: 6,
          })
          setTimeout(() => {

            rotateAllCards(360)
          }, 300)
        }
      })
    })
  },
  true
)
