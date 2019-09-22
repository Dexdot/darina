<template>
  <div
    id="app"
    :class="[{ 'app--faded': caseHovered, 'app--fullscreen': caseFullscreen }]"
    :style="{
      '--color-text': `#${activeColor.text}`,
      '--color-bg': `#${activeColor.bg}`
    }"
    @click="onAppClick"
  >
    <router-link class="logo" to="/">Darina Yurina</router-link>
    <nav class="nav">
      <ul class="u-flex">
        <li class="nav__li">
          <router-link class="nav__link" to="/">Cases</router-link>
        </li>
        <li class="nav__li">
          <router-link class="nav__link" to="/about">About</router-link>
        </li>
      </ul>
    </nav>
    <Menu :active="isMenuActive" />

    <div class="scroll-container" ref="container">
      <main
        class="scroll-inner"
        ref="inner"
        :style="{ transform: `translate3d(0, -${this.translate}px, 0)` }"
      >
        <transition @enter="enter" @leave="leave" :css="false" mode="out-in">
          <router-view
            :key="$route.path"
            :scroll="getTranslate()"
            @case-mouseover="onCaseMouseover"
            @case-mouseout="onCaseMouseout"
          />
        </transition>
      </main>
    </div>
  </div>
</template>

<script>
import VirtualScroll from 'virtual-scroll'
// import inobounce from 'inobounce'

import Menu from '@/Menu'

import loop from '@/scripts/loop'
import { fetchPalette } from '@/scripts/api'
import { isSafari, isMACOS, isMobileDevice } from '@/scripts/detect'

import transitions from '@/transitions/'

const roundDec = n => Math.round(n * 100) / 100
const lerp = (a, b, n) => (1 - n) * a + n * b
const detectDevices = () => {
  if (isMACOS()) {
    document.querySelector('body').classList.add('is-macos')
  }
  if (isSafari()) {
    document.querySelector('body').classList.add('is-safari')
  }
  if (isMobileDevice()) {
    document.querySelector('body').classList.add('is-mob')
  }
}

export default {
  name: 'App',
  components: {
    Menu
  },
  data: () => ({
    colorIndex: 0,
    colors: [{ bg: 'EEE0D5', text: '1F2020' }],
    isMenuActive: false,
    caseHovered: false,
    caseFullscreen: false,
    scroll: 0,
    translate: 0,
    deltaY: 0,
    vs: null,
    winHeight: 0,
    dir: {}
  }),
  computed: {
    activeColor() {
      return this.colors[this.colorIndex]
    }
  },
  async created() {
    this.setColors(await fetchPalette())
  },
  mounted() {
    detectDevices()

    // Window height
    this.getWinHeight()
    window.addEventListener('resize', this.getWinHeight.bind(this))

    // Start RAF
    loop.start()

    // On Scroll
    this.vs = new VirtualScroll({
      mouseMultiplier: 0.8,
      touchMultiplier: 4,
      passive: true
    })

    if (isSafari() || isMobileDevice()) {
      window.addEventListener('scroll', this.defaultScroll.bind(this))
    } else {
      this.vs.on(this.onScroll)
      loop.add(this.checkSmooth.bind(this), 'checkSmooth')
    }

    // Start Inobounce
    // inobounce.enable()
  },
  destroyed() {
    window.removeEventListener('resize', this.getWinHeight.bind(this))

    if (isSafari() || isMobileDevice()) {
      window.removeEventListener('scroll', this.defaultScroll.bind(this))
    } else {
      this.vs.off(this.onScroll)
      loop.remove(this.checkSmooth.bind(this), 'checkSmooth')
    }
  },
  methods: {
    getTranslate() {
      return isSafari() || isMobileDevice() ? this.scroll : this.translate
    },
    getWinHeight() {
      this.winHeight = window.innerHeight
    },
    toggleMenu() {
      this.isMenuActive = !this.isMenuActive
    },
    onScroll({ deltaY }) {
      this.deltaY = deltaY
      const scroll = this.scroll + -1 * deltaY

      this.scroll = Math.min(
        Math.max(scroll, 0),
        this.$refs.inner.getBoundingClientRect().height - this.winHeight
      )
    },
    checkSmooth() {
      const roundTranslate = Math.round(this.translate)
      const roundScroll = Math.round(this.scroll)

      if (roundScroll !== roundTranslate) {
        this.translate = roundDec(lerp(this.translate, this.scroll, 0.03))

        // Round scroll (chrome transform bluring)
        if (
          roundTranslate >= roundScroll - 1 &&
          roundTranslate <= roundScroll + 1
        ) {
          this.translate = Math.round(lerp(this.translate, this.scroll, 0.03))
        }
      }
    },
    defaultScroll({ deltaY }) {
      this.deltaY = deltaY
      this.scroll = window.pageYOffset
    },
    setColors(colors) {
      this.colors = [
        ...colors.map(pair => {
          const [bg, text] = pair.split(' ')
          return { bg, text }
        })
      ]
    },
    onAppClick() {
      if (this.colorIndex === this.colors.length - 1) {
        this.colorIndex = 0
      } else {
        this.colorIndex = this.colorIndex + 1
      }
    },
    onCaseMouseover(fullscreen) {
      this.caseHovered = true
      this.caseFullscreen = fullscreen
    },
    onCaseMouseout() {
      this.caseHovered = false
      this.caseFullscreen = false
    },
    async enter(el, done) {
      // const transitionEnter =
      //   this.dir.from.name === this.dir.to.name ? 'cases' : this.dir.to.name
      // await transitions['main'].enter(el)
      const transitionEnter = this.dir.to.name
      await transitions[transitionEnter].enter(el)

      done()
    },
    async leave(el, done) {
      if (this.isMenuActive) this.toggleMenu()

      // const transitionLeave =
      //   this.dir.from.name === this.dir.to.name ? 'cases' : this.dir.from.name
      // await transitions['main'].leave(el)
      const transitionLeave = this.dir.from.name
      await transitions[transitionLeave].leave(el)

      this.scroll = 0
      this.translate = 0
      window.scrollTo(0, 0)

      done()
    }
  },
  watch: {
    $route(to, from) {
      this.dir = { to, from }
    }
  }
}
</script>

<style lang="sass">
body.is-macos:not(.is-safari)
  overflow: hidden

.is-safari,
.is-mob
  // overflow: unset !important

  .scroll-container
    width: auto !important
    height: auto !important
    overflow: unset !important
</style>

<style lang="sass" scoped>
@import "~@/sass/utils"

#app
  min-height: 100vh
  min-height: calc(var(--vh, 1vh) * 100)
  color: var(--color-text)
  background: var(--color-bg)

  /deep/ a
    &,
    &:visited,
    &:active,
    &:focus
      color: var(--color-text)

.app--faded
  .logo, .nav
    opacity: 0.35

.app--fullscreen
  color: #fff

  /deep/ a
    &,
    &:visited,
    &:active,
    &:focus
      color: #fff


.scroll-container
  width: 100vw

.scroll-container
  height: 100vh
  height: calc(var(--vh, 1vh) * 100)
  overflow: hidden

.logo, .nav
  transition: opacity 0.25s ease

.logo
  +eng(b)
  font-size: 16px
  text-transform: uppercase
  letter-spacing: 0.24em

  z-index: 2
  position: fixed
  top: var(--unit-v)
  left: var(--unit-h)

.nav
  z-index: 2
  position: fixed
  bottom: var(--unit-v)
  left: var(--unit-h)

  @media (max-width: 500px)
    display: none

.nav__li:not(:first-child)
  margin-left: 32px

.nav__link
  +eng(b)
  font-size: 14px
  text-transform: uppercase
  letter-spacing: 0.16em

  position: relative
  &::before
    content: ''
    position: absolute
    bottom: 100%
    left: 50%
    transform: translate(-50%, -16px)

    width: 4px
    height: 4px

    background: var(--color-text)
    border-radius: 50%
    opacity: 0
    transition: 0.2s ease

.nav__link.router-link-exact-active::before,
.nav__link:hover::before
  transform: translate(-50%, -8px)
  opacity: 1
</style>
