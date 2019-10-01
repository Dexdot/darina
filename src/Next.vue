<template>
  <section class="next">
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
    to: { type: [String, Object], default: '/' }
  }
}
</script>

<style lang="sass" scoped>
@import "~@/sass/utils"

.next
  position: relative

  width: 100vw
  height: 100vh
  // height: calc(var(--vh, 1vh) * 100)
  padding-right: var(--unit-h)
  padding-bottom: 20vh

  display: none
  flex-direction: column
  justify-content: flex-end
  align-items: flex-end

  text-align: right
  background: #000

  &,
  & a
    color: #fff !important

  @media (max-width: 500px)
    display: flex

.next__title
  line-height: 1
  +man
  font-size: 48px

  display: block
  margin-bottom: 8px

.next-container p
  opacity: 0.3
</style>
