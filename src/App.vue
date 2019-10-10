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
    <!-- Header, nav -->
    <router-link
      ref="logo"
      :class="['logo', { hidden: isCase || hideNav }]"
      to="/"
      >Darina Yurina</router-link
    >

    <MenuButton
      :active="isMenuActive"
      :hidden="isCase || hideNav"
      @click="toggleMenu"
    />

    <nav :class="['nav', { hidden: isCase || hideNav }]">
      <ul class="u-flex">
        <li class="nav__li">
          <router-link class="nav__link" to="/">Cases</router-link>
        </li>
        <li class="nav__li">
          <router-link class="nav__link" to="/about">About</router-link>
        </li>
      </ul>
    </nav>

    <!-- Modals -->
    <Menu :active="isMenuActive" @click="isMenuActive = false" />
    <Credits :active="isCreditsActive" @credits-close="toggleCredits(false)" />
    <Intro ref="intro" v-if="!visited" @complete="onIntroComplete" />

    <!-- Next -->
    <Next v-if="nextName === 'about'" to="/">
      <span slot="title">Cases</span>
      <span slot="text">2017-2019</span>
    </Next>

    <Next v-if="nextName === 'main'" to="/about" right :cover="$refs.nextcover">
      <span slot="title">About</span>
      <span slot="text">account & project management</span>
    </Next>

    <div class="next-observe" ref="nextcover"></div>

    <!-- Scroll -->
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
import Next from '@/Next'

import loop from '@/scripts/loop'
import { fetchPalette } from '@/scripts/api'
import { isSafari, isMACOS, isMobileDevice } from '@/scripts/detect'
import { roundDec, lerp, mapColors } from '@/scripts/helpers'

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

export default {
  name: 'App',
  components: {
    Intro,
    Menu,
    Credits,
    MenuButton,
    Next
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
    dir: {},
    nextName: '',
    isCase: ''
  }),
  computed: {
    activeColor() {
      if (this.$route.name === 'case') {
        const { id } = this.$route.params

        const project = this.$store.getters.cases.find(
          v => v.fields.slug === id
        )

        if (!project) return this.colors[this.colorIndex]
        const { palette } = project.fields
        const [bg, text] = palette.split(' ')

        return { bg, text }
      } else {
        return this.colors[this.colorIndex]
      }
    },
    hideNav() {
      return isSafari() || isMobileDevice() ? false : !this.isNotScrolling
    }
  },
  async created() {
    this.visited = localStorage.visited
    if (!localStorage.visited) {
      localStorage.visited = true
    }

    this.setColors(await fetchPalette())
    this.colorIndex = Math.floor(Math.random() * this.colors.length)
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
      this.checkScrollStop()
      // this.isNotScrolling = true
    } else {
      this.vs.on(this.onScroll)
      loop.add(this.checkSmooth.bind(this), 'checkSmooth')
    }
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
    toggleCredits(show) {
      this.isCreditsActive = show
    },
    onScroll({ deltaY }) {
      if (!this.isMenuActive && !this.isCreditsActive)
        this.isNotScrolling = false

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
    defaultScroll({ deltaY }) {
      this.deltaY = deltaY
      this.scroll = window.pageYOffset
    },
    checkScrollStop() {
      let timer
      window.addEventListener('scroll', () => {
        this.isNotScrolling = false
        clearTimeout(timer)
        timer = setTimeout(() => {
          this.isNotScrolling = true
        }, 250)
      })
    },
    setColors(colors) {
      this.colors = mapColors(colors)
    },
    onAppClick({ target }) {
      const tag = target.tagName.toLowerCase()
      const { className } = target

      const tags = ['a', 'button', 'svg', 'path']
      const classes = ['stories-link', 'swiper-', 'story-img', 'menu-btn']

      if (
        this.$route.name === 'case' ||
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
      const transitionEnter = this.dir.to.name
      await transitions[transitionEnter].enter(el)

      done()
    },
    async leave(el, done) {
      if (this.isMenuActive) this.toggleMenu()

      const transitionLeave = this.dir.from.name
      await transitions[transitionLeave].leave(el)

      this.nextName = this.dir.to.name
      this.isCase = this.$route.name === 'case'

      this.scroll = 0
      this.translate = 0
      window.scrollTo(0, 0)

      done()
    }
  },
  watch: {
    $route(to, from) {
      if (this.nextName === '') this.nextName = this.$route.name
      if (this.isCase === '') this.isCase = this.$route.name === 'case'

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

  @media (max-width: 500px)
    position: relative
    padding-bottom: 200px


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

.is-mob
  .logo, #app .menu-btn:not(.active)
    position: absolute

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
  height: 100vh
  height: calc(var(--vh, 1vh) * 100)
  overflow: hidden

  @media (max-width: 500px)
    background: var(--color-bg)
    position: relative
    z-index: 1

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


.next-observe
  position: absolute
  bottom: 0
  left: 0
  width: 100%
  height: 200px

  pointer-events: none

  display: none
  @media (max-width: 500px)
    display: block
</style>
