<template>
  <ul class="intro">
    <li class="intro__li" v-for="(slide, i) in slides" :key="slide">
      <img
        v-show="i === index"
        class="intro__img"
        :src="require(`./assets/intro/${slide}.jpg`)"
        role="presentation"
      />
    </li>
    <li class="intro__logo">Darina Yurina</li>
  </ul>
</template>

<script>
import imagesLoaded from 'imagesloaded'

const desktop = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10']
const mob = ['1', '2', '5', '6', '7', '8', '9', '10']
const slides = window.innerWidth > 500 ? desktop : mob

export default {
  name: 'Intro',
  data: () => ({
    slides,
    delay: 280,
    index: 0,
    interval: null
  }),
  created() {
    imagesLoaded('.intro', () => {
      this.start()
    })
  },
  methods: {
    start() {
      this.interval = setInterval(() => {
        if (this.index === this.slides.length - 1) {
          clearInterval(this.interval)
          this.$emit('complete')
        } else {
          this.index = this.index + 1
        }
      }, this.delay)
    }
  }
}
</script>

<style lang="sass" scoped>
@import "~@/sass/utils"

.intro
  z-index: 3
  position: fixed
  top: 0
  left: 0

  width: 100vw
  height: 100vh
  height: calc(var(--vh, 1vh) * 100)
  pointer-events: none
  user-select: none

.intro__img
  z-index: 1
  position: absolute
  top: 0
  left: 0

  width: 100%
  height: 100%

  object-fit: cover

.intro__logo
  +eng(b)
  font-size: 16px
  text-transform: uppercase
  letter-spacing: 0.24em

  z-index: 1
  position: absolute
  top: 50vh
  left: 50vw
  transform: translate(-50%, -50%)
  color: #fff !important
</style>
