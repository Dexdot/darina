<template>
  <section :class="['next', { right }]">
    <div class="next__bg"></div>
    <div :class="['next-container', { visible }]">
      <div class="u-ovh">
        <router-link class="next-anim" :to="to">
          <h2 class="next__title">
            <slot name="title"></slot>
          </h2>
        </router-link>
      </div>
      <div class="u-ovh">
        <p class="next-anim"><slot name="text"></slot></p>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'Next',
  props: {
    to: { type: [String, Object], default: '/' },
    right: { type: Boolean, default: false }
  },
  data: () => ({
    visible: false
  }),
  mounted() {
    this.observe()
  },
  methods: {
    observe() {
      const observer = new IntersectionObserver(
        entries => {
          entries.forEach(({ intersectionRatio, isIntersecting }) => {
            this.visible = isIntersecting && intersectionRatio >= 0.8
          })
        },
        { threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1] }
      )

      const cover = document.querySelector('.next-observe')
      if (cover) observer.observe(cover)
    }
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

  display: flex
  flex-direction: column
  justify-content: flex-end
  align-items: flex-start

  text-align: left
  // background: #000

  // &,
  // & a
  //   color: #fff !important

  @media (min-width: 501px)
    display: none

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
  filter: brightness(0.9)

.next__title
  line-height: 1
  +man
  font-size: 48px

  display: block
  // margin-bottom: 8px

.next-container
  position: relative
  z-index: 1

.next-anim
  display: block
  transform: translate3d(0, 100%, 0)
  transition: transform 1.2s cubic-bezier(.25,.75,.34,.98)

.next-container.visible
  .next-anim
    transform: translate3d(0, 0%, 0)

.next-container p
  opacity: 0.8

  &.next-anim
    transition-delay: 0.1s
  // opacity: 0.3
</style>
