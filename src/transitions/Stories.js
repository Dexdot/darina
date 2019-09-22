import anime from 'animejs'

const enter = (el, cb) =>
  new Promise(resolve => {
    anime.set('.logo, .nav', { 'pointer-events': 'none', opacity: 0 })

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
      begin: () => {
        anime({
          targets: el.querySelectorAll('.stories-link'),
          duration: 600,
          opacity: [0, 1],
          easing: 'easeOutExpo'
        })
      },
      complete: () => {
        resolve()
        if (cb) cb()
      }
    })
  })

const leave = (el, cb) =>
  new Promise(resolve => {
    anime({
      targets: el.querySelector('.stories-head'),
      opacity: [1, 0],
      duration: 400,
      easing: 'easeInOutSine',
      complete: () => {
        anime.set('.logo, .nav', {
          'pointer-events': 'auto',
          opacity: ''
        })
      }
    })
    anime({
      targets: el.querySelectorAll('.story-img'),
      duration: 600,
      delay: anime.stagger(50),
      opacity: [1, 0],
      translateX: ['0%', '-100%'],
      easing: 'easeInOutSine',
      begin: () => {
        anime({
          targets: el.querySelectorAll('.stories-link'),
          duration: 600,
          opacity: [1, 0],
          easing: 'easeOutExpo'
        })
      },
      complete: () => {
        resolve()
        if (cb) cb()
      }
    })
  })

export default { enter, leave }
