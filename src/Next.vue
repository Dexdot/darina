<template>
  <!-- <section :class="['next', { visible }]"> -->
  <section class="next">
    <div :class="['next__bg', { visible }]"></div>
    <div class="next-container">
      <router-link :to="to">
        <h2 class="next__title">
          <slot name="title"></slot>
        </h2>
      </router-link>
      <p><slot name="text"></slot></p>
    </div>
  </section>
</template>

<script>
// import anime from 'animejs'

export default {
  name: 'Next',
  props: {
    to: { type: [String, Object], default: '/' }
  },
  data: () => ({
    easing: 'cubicBezier(0.25, 0.1, 0.25, 1)',
    visible: false,
    isAnimating: false
    // counter: 3,
    // counterEl: null
  }),
  mounted() {
    // this.counterEl = this.$refs.counter
    this.observe()
  },
  methods: {
    //   startCount() {
    //     const tl = anime.timeline({
    //       delay: this.counter === 5 ? 300 : 0,
    //       easing: this.easing,
    //       complete: () => {
    //         if (this.counter <= 1) {
    //           this.isAnimating = false
    //           this.$router.push(this.to)
    //         } else {
    //           this.counter--
    //           this.startCount()
    //         }
    //       }
    //     })

    //     const duration = 200
    //     const show = targets => ({
    //       // opacity: [0, 1],
    //       translateY: ['-15%', '0%'],
    //       targets,
    //       duration
    //     })
    //     const hide = targets => ({
    //       // opacity: [1, 0],
    //       translateY: ['0%', '15%'],
    //       targets,
    //       duration,
    //       delay: duration * 1.5
    //     })

    //     tl.add(show(this.counterEl)).add(hide(this.counterEl))
    //   },
    //   stopCount() {
    //     this.isAnimating = false
    //     anime.remove(this.counterEl)
    //     anime({
    //       targets: this.counterEl,
    //       opacity: 0,
    //       duration: 200,
    //       easing: this.easing,
    //       complete: () => {
    //         this.counter = 3
    //       }
    //     })
    //   },
    observe() {
      const observer = new IntersectionObserver(
        entries => {
          entries.forEach(entry => {
            this.visible = entry.intersectionRatio >= 0.6

            // if (entry.intersectionRatio >= 0.6) {
            //   if (!this.isAnimating) {
            //     this.isAnimating = true
            //     this.startCount()
            //   }
            // } else {
            //   this.stopCount()
            // }
          })
        },
        { threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1] }
      )
      observer.observe(this.$el)
    }
  }
}
</script>

<style lang="sass" scoped>
@import "~@/sass/utils"

.next
  position: relative

  width: 100vw
  height: 100vh
  height: calc(var(--vh, 1vh) * 100)
  padding-right: var(--unit-h)
  padding-bottom: 20vh

  display: none
  flex-direction: column
  justify-content: flex-end
  align-items: flex-end

  text-align: right

  &,
  & a
    color: #fff !important

  @media (max-width: 500px)
    display: flex

.next__bg
  z-index: -1
  position: fixed
  top: 0
  left: 0
  width: 100%
  height: 100%

  pointer-events: none
  background: #000
  transition: opacity 0.4s ease
  opacity: 0
  &.visible
    opacity: 1

.next__title
  line-height: 1
  +man
  font-size: 48px

  display: block
  margin-bottom: 8px

.next-container p
  opacity: 0.3
</style>
