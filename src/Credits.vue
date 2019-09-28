<template>
  <transition name="credits">
    <section class="credits" v-show="active">
      <div class="credits__overlay"></div>

      <nav class="credits__nav">
        <ul>
          <li>
            <a href="http://nickadams.now.sh" target="_blank">
              <img :src="require('./assets/design.svg')" alt="Design" />
              <p>Nick Adams</p>
            </a>
          </li>
          <li>
            <a href="http://hvxzcb.ru" target="_blank">
              <img
                :src="require('./assets/development.svg')"
                alt="Development"
              />
              <p>Kamil Sometimes</p>
            </a>
          </li>
          <li>
            <button @click="$emit('credits-close')">
              <img :src="require('./assets/management.svg')" alt="Management" />
              <p>Darina Yurina</p>
            </button>
          </li>
        </ul>
      </nav>

      <div class="credits__close">
        <MenuButton active @click="$emit('credits-close')" />
      </div>
    </section>
  </transition>
</template>

<script>
import MenuButton from '@/MenuButton'

export default {
  name: 'Credits',
  components: {
    MenuButton
  },
  props: {
    active: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style lang="sass" scoped>
@import "~@/sass/utils"

/* ENTER */
.credits-enter
  pointer-events: none

  nav li,
  .credits__close
    opacity: 0
    transform: translateY(16px)

  .credits__overlay
    transform: translateY(101%)


.credits-enter-to
  pointer-events: auto

  .credits__overlay,
  .credits__close,
  nav li
    opacity: 1
    transform: translateY(0%)


.credits-enter-active
  transition: 1s ease-in-out

  .credits__overlay
    transition: 0.8s cubic-bezier(0.645, 0.045, 0.355, 1)

  .credits__close
    transition: 0.4s ease

@for $i from 1 through 3
  .credits-enter-active .credits__nav li:nth-child(#{$i})
    transition: 0.4s ease (#{$i*0.05s + 0.4s})


/* LEAVE */
.credits-leave
  pointer-events: auto

  nav li
    opacity: 1

  .credits__overlay,
  .credits__close,
  nav li
    transform: translateY(0%)

.credits-leave-to
  pointer-events: none

  nav li,
  .credits__close
    opacity: 0

  .credits__overlay
    transform: translateY(101%)

.credits-leave-active
  transition: 1s ease-in-out

  .credits__close
    transition: 0.4s ease

  .credits__overlay
    transition: 0.8s cubic-bezier(0.645, 0.045, 0.355, 1)

@for $i from 1 through 3
  .credits-leave-active .credits__nav li:nth-child(#{$i})
    transition: 0.4s ease (#{$i*0.05s})

.credits
  z-index: 3
  position: fixed
  top: 0
  left: 0
  right: 0
  bottom: 0

  width: 100vw
  height: 100vh
  height: calc(var(--vh, 1vh) * 100)


// Overlay
.credits__overlay
  background: #000
  position: absolute
  top: 0
  left: 0
  width: 100vw
  height: 100vh
  height: calc(var(--vh, 1vh) * 100)

.credits__nav
  z-index: 1
  position: absolute
  top: 50%
  left: 50%
  transform: translate(-50%, -50%)

  text-align: center

  width: 100%

.credits__nav img
  display: block
  height: 16px
  margin-left: auto
  margin-right: auto

.credits__nav p
  +eng(b)
  font-size: 16px
  text-transform: uppercase
  letter-spacing: 0.24em

.credits__nav li:not(:last-child)
  display: block
  margin-bottom: 24px

.credits__nav
  &,
  /deep/ a
    &,
    &:visited,
    &:active,
    &:focus
      color: #fff !important

.credits__close
  position: fixed
  bottom: var(--unit-v)
  right: var(--unit-h)

// HOVER
.credits__nav
  display: flex
  flex-direction: column
  align-items: center

.credits__nav li
  transition: 0.25s cubic-bezier(0.25, 0.1, 0.25, 1)

.credits__nav ul:hover li
  opacity: 0.3

.credits__nav ul li:hover
  opacity: 1
</style>
