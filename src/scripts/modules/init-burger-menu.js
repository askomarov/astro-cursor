import gsap from 'gsap'

const initBurgerMenu = () => {
  const burgerButton = document.querySelector('.button-burger')
  const burgerMenu = document.querySelector('.burger-menu')

  const tl = gsap.timeline({ paused: true })

  tl.to(burgerMenu, {
    duration: 0.5,
    opacity: 1,
    xPercent: 0,
    ease: 'power1.in',
  })
  tl.from('.burger-menu__item', {
    duration: 1,
    opacity: 0,
    y: 20,
    stagger: 0.1,
    ease: 'expo.inOut',
  }, '-=0.5')

  gsap.set(burgerMenu, {
    xPercent: -100,
    opacity: 0
  })
  tl.reverse()

  const toggleMenu = () =>{
    tl.reversed(!tl.reversed())
  }

  burgerButton.addEventListener('click', toggleMenu)
}
export { initBurgerMenu }
