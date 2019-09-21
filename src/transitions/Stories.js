import anime from 'animejs'

const enter = (el, cb) =>
  new Promise(resolve => {
    anime.set('.logo, .nav', { opacity: 0 })

    // 250 = swiper-slide transition-dur (active slide scaled)
    anime({
      targets: el.querySelector('.stories-head'),
      opacity: [0, 1],
      delay: 250,
      duration: 600,
      easing: 'easeOutSine'
    })
    anime({
      targets: el.querySelectorAll('.story-img'),
      duration: 1200,
      delay: anime.stagger(100, { start: 250 }),
      opacity: [0, 1],
      translateX: ['100%', '0%'],
      easing: 'easeOutExpo',
      complete: () => {
        if (cb) cb()
      },
      update: ({ progress }) => {
        if (progress >= 80) resolve()
      }
    })
  })

const leave = (el, cb) =>
  new Promise(resolve => {
    anime.set('.logo, .nav', { opacity: '' })

    anime({
      targets: el.querySelector('.stories-head'),
      opacity: [1, 0],
      duration: 400,
      easing: 'easeInOutSine'
    })
    anime({
      targets: el.querySelectorAll('.story-img'),
      duration: 600,
      delay: anime.stagger(50),
      opacity: [1, 0],
      translateX: ['0%', '-100%'],
      easing: 'easeInOutSine',
      complete: () => {
        if (cb) cb()
      },
      update: ({ progress }) => {
        if (progress >= 80) resolve()
      }
    })
  })

export default { enter, leave }
