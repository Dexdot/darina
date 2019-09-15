import anime from 'animejs'

const easing = 'easeInOutCirc'

const enter = (el, cb) =>
  new Promise(resolve => {
    const tl = anime.timeline({
      complete: () => {
        if (cb) cb()
      },
      easing
    })

    tl.add(
      {
        targets: '.cover',
        translateY: ['0%', '-100%'],
        duration: 1000,
        update: ({ progress }) => {
          if (progress >= 60) resolve()
        }
      },
      0
    )
    tl.add(
      {
        targets: el,
        translateY: ['200px', '0px'],
        duration: 1000
      },
      0
    )
  })

const leave = (el, cb) =>
  new Promise(resolve => {
    anime({
      targets: '.cover',
      translateY: ['100%', '0%'],
      duration: 800,
      easing,
      complete: () => {
        resolve()
        if (cb) cb()
      }
    })
  })

export default { enter, leave }
