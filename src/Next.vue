<template>
  <section :class="['next', { right }]">
    <div class="next__bg"></div>
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
export default {
  name: 'Next',
  props: {
    to: { type: [String, Object], default: '/' },
    right: { type: Boolean, default: false }
  }
}
</script>

<style lang="sass" scoped>
@import "~@/sass/utils"

.next
  position: fixed
  bottom: 0
  left: 0

  width: 100vw
  height: 200px
  padding-left: var(--unit-h)
  padding-bottom: 40px

  display: none
  flex-direction: column
  justify-content: flex-end
  align-items: flex-start

  text-align: left
  // background: #000

  // &,
  // & a
  //   color: #fff !important

  @media (max-width: 500px)
    display: flex

.next.right
  align-items: flex-end
  text-align: right
  padding-right: var(--unit-h)

.next__bg
  position: absolute
  top: 0
  left: 0
  width: 100%
  height: 100%
  background: var(--color-bg)
  filter: brightness(0.8)

.next__title
  line-height: 1
  +man
  font-size: 48px

  display: block
  // margin-bottom: 8px

.next-container
  position: relative
  z-index: 1

.next-container p
  opacity: 0.8
  // opacity: 0.3
</style>
