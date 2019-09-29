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
    <router-link
      ref="logo"
      :class="['logo', { hidden: !isNotScrolling }]"
      to="/"
      >Darina Yurina</router-link
    >

    <MenuButton
      :active="isMenuActive"
      :hidden="!isNotScrolling"
      @click="toggleMenu"
    />

    <nav :class="['nav', { hidden: !isNotScrolling }]">
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
    <Credits :active="isCreditsActive" @credits-close="toggleCredits(false)" />
    <Intro ref="intro" v-if="!visited" @complete="onIntroComplete" />

    <div class="scroll-container" ref="container">
      <main
        class="scroll-inner"
        ref="inner"
        :style="{ transform: `translate3d(0, -${this.translate}px, 0)` }"
      >
        <transition
          v-if="visited || introCompleted"
          @enter="enter"
          @leave="leave"
          :css="false"
          mode="out-in"
        >
          <router-view
            :key="$route.path"
            :scroll="getTranslate()"
            :aboutTranslate="aboutTranslate"
            :isNotScrolling="isNotScrolling"
            @case-mouseover="onCaseMouseover"
            @case-mouseout="onCaseMouseout"
            @credits-click="toggleCredits($event)"
          />
        </transition>
      </main>
    </div>
  </div>
</template>

<script>
import VirtualScroll from 'virtual-scroll'
import anime from 'animejs'

import Intro from '@/Intro'
import Menu from '@/Menu'
import Credits from '@/Credits'
import MenuButton from '@/MenuButton'

import loop from '@/scripts/loop'
import { fetchPalette } from '@/scripts/api'
import { isSafari, isMACOS, isMobileDevice } from '@/scripts/detect'
import { roundDec, lerp } from '@/scripts/math'

import transitions from '@/transitions/'

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

let interval

export default {
  name: 'App',
  components: {
    Intro,
    Menu,
    Credits,
    MenuButton
  },
  data: () => ({
    colorIndex: 0,
    colors: [{ bg: 'EEE0D5', text: '1F2020' }],
    visited: false,
    introCompleted: false,
    isMenuActive: false,
    isCreditsActive: false,
    caseHovered: false,
    caseFullscreen: false,
    isNotScrolling: true,
    aboutScroll: 0,
    aboutTranslate: 0,
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
    this.visited = localStorage.visited
    if (!localStorage.visited) {
      localStorage.visited = true
    }

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
      firefoxMultiplier: 25,
      passive: true
    })

    if (isSafari() || isMobileDevice()) {
      window.addEventListener('scroll', this.defaultScroll.bind(this))
      this.isNotScrolling = true
    } else {
      this.vs.on(this.onScroll)
      loop.add(this.checkSmooth.bind(this), 'checkSmooth')
      loop.add(this.aboutSmooth.bind(this), 'aboutSmooth')
      interval = setInterval(this.aboutHandler.bind(this), 35)
    }
  },
  destroyed() {
    window.removeEventListener('resize', this.getWinHeight.bind(this))
    window.clearInterval(interval)

    if (isSafari() || isMobileDevice()) {
      window.removeEventListener('scroll', this.defaultScroll.bind(this))
    } else {
      this.vs.off(this.onScroll)
      loop.remove(this.checkSmooth.bind(this), 'checkSmooth')
      loop.remove(this.aboutSmooth.bind(this), 'aboutSmooth')
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
    toggleCredits(show) {
      this.isCreditsActive = show
    },
    aboutHandler() {
      if (this.isNotScrolling) {
        this.onAboutScroll()
      }
    },
    onAboutScroll(deltaY = -1) {
      const aboutScroll = this.aboutScroll + -1 * deltaY

      this.aboutScroll = Math.min(
        Math.max(aboutScroll, 0),
        window.innerHeight * 0.52 + 156
      )
    },
    onScroll({ deltaY }) {
      if (!this.isMenuActive && !this.isCreditsActive)
        this.isNotScrolling = false

      this.deltaY = deltaY
      this.onAboutScroll(deltaY)
      const scroll = this.scroll + -1 * deltaY

      this.scroll = Math.min(
        Math.max(scroll, 0),
        // this.$refs.inner.getBoundingClientRect().height - this.winHeight
        this.$refs.inner.getBoundingClientRect().height -
          this.winHeight -
          this.aboutScroll / 2
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
          this.isNotScrolling = true
          this.translate = Math.round(lerp(this.translate, this.scroll, 0.03))
        }

        if (
          roundTranslate >= roundScroll - 50 &&
          roundTranslate <= roundScroll + 50
        ) {
          this.isNotScrolling = true
        }
      }
    },
    aboutSmooth() {
      const roundTranslate = Math.round(this.aboutTranslate)
      const roundScroll = Math.round(this.aboutScroll)

      if (roundScroll !== roundTranslate) {
        this.aboutTranslate = roundDec(
          lerp(this.aboutTranslate, this.aboutScroll, 0.01)
        )

        // Round scroll (chrome transform bluring)
        if (
          roundTranslate >= roundScroll - 1 &&
          roundTranslate <= roundScroll + 1
        ) {
          this.aboutTranslate = Math.round(
            lerp(this.aboutTranslate, this.aboutScroll, 0.01)
          )
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
    onAppClick({ target }) {
      const tag = target.tagName.toLowerCase()
      const { className } = target

      const tags = ['a', 'button', 'svg', 'path']
      const classes = ['stories-link', 'swiper-', 'story-img', 'menu-btn']

      if (
        tags.indexOf(tag) !== -1 ||
        classes.some(cls => className.indexOf(cls) !== -1)
      )
        return false

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
    onIntroComplete() {
      anime({
        targets: this.$refs.intro.$el,
        opacity: [1, 0],
        scale: [1, 1.1],
        zIndex: -1,
        easing: 'easeInOutCirc',
        duration: 600,
        complete: () => {
          this.introCompleted = true
        }
      })
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
  .logo, .nav, .menu-btn
    opacity: 0.35

.logo, .nav, .menu-btn
  &.hidden
    opacity: 0
    pointer-events: none

#app .menu-btn
  z-index: 3
  position: fixed
  top: var(--unit-v)
  right: var(--unit-h)

  display: none

  @media (max-width: 500px)
    display: flex

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

    width: 4px
    height: 4px

    background: var(--color-text)
    border-radius: 50%
    transition: 0.2s ease

.nav__link:not(.router-link-exact-active)::before
  transform: translate(-50%, -16px)
  opacity: 0

.nav__link.router-link-exact-active::before
  transform: translate(-50%, -8px)
  opacity: 1

.nav:hover
  .nav__link:not(.router-link-exact-active)::before,
  .nav__link.router-link-exact-active::before
    transform: translate(-50%, -16px)
    opacity: 0

.nav
  .nav__link:not(.router-link-exact-active):hover::before,
  .nav__link.router-link-exact-active:hover::before
    transform: translate(-50%, -8px)
    opacity: 1
</style>
