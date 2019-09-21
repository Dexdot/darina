<template>
  <section class="stories-section" v-if="project">
    <div class="stories-head">
      <p class="stories-caption">{{ project.fields.title }}</p>
      <router-link class="stories-close" to="/">
        <svg
          width="32"
          height="32"
          viewBox="0 0 32 32"
          fill="none"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M24 8L8 24" />
          <path d="M8 8L24 24" />
        </svg>
      </router-link>
    </div>

    <swiper :options="swiperOptions" ref="swiper">
      <swiper-slide v-for="story in project.fields.stories" :key="story.sys.id">
        <div class="story-img">
          <img
            :src="story.fields.file.url"
            :alt="story.fields.title"
            class="story-img__i"
          />
        </div>
      </swiper-slide>
    </swiper>

    <!-- <router-link
      class="stories-link stories-link--prev"
      :to="`/case/${prevCase.fields.slug}`"
      v-if="prevCase"
      v-show="$refs.swiper && $refs.swiper.swiper.activeIndex === 0"
    >
      {{ prevCase.fields.title }}
    </router-link>

    <router-link
      class="stories-link stories-link--next"
      :to="`/case/${nextCase.fields.slug}`"
      v-if="nextCase"
      v-show="
        $refs.swiper &&
          $refs.swiper.swiper.activeIndex === project.fields.stories.length - 1
      "
    >
      {{ nextCase.fields.title }}
    </router-link> -->
  </section>
</template>

<script>
import 'swiper/dist/css/swiper.css'
import { swiper, swiperSlide } from 'vue-awesome-swiper'
import { mapGetters } from 'vuex'

export default {
  name: 'Stories',
  components: {
    swiper,
    swiperSlide
  },
  data: () => ({
    swiperOptions: {
      initialSlide: 0,
      speed: 400,
      slidesPerView: 'auto',
      autoHeight: true,
      centeredSlides: true,
      slideToClickedSlide: true,
      grabCursor: true
    }
  }),
  computed: {
    project() {
      return this.cases.length > 0
        ? this.cases.find(el => el.fields.slug === this.$route.params.id)
        : null
    },
    setPrev() {
      const currentCaseIndex = this.cases.indexOf(this.project)

      return currentCaseIndex === 0
        ? this.cases[this.cases.length - 1]
        : this.cases[currentCaseIndex - 1]
    },
    setNext() {
      const currentCaseIndex = this.cases.indexOf(this.project)

      return currentCaseIndex === this.cases.length - 1
        ? this.cases[0]
        : this.cases[currentCaseIndex + 1]
    },
    ...mapGetters(['cases'])
  },
  mounted() {
    this.$emit('case-mouseout')
  },
  beforeDestroy() {
    this.$refs.swiper.swiper.destroy(true, false)
  }
}
</script>

<style lang="sass" scoped>
@import "~@/sass/utils"

// Styles
.stories-head
  width: 100%
  display: flex
  justify-content: space-between

  position: absolute
  top: 48px
  padding: 0 var(--unit)
  @media (max-width: 500px)
    top: 32px

.stories-section
  z-index: 3
  position: fixed
  top: 0
  left: 0
  right: 0
  bottom: 0

  padding-top: 13vh
  width: 100vw
  height: 100vh
  height: calc(var(--vh, 1vh) * 100)

.stories-caption
  +eng(b)
  font-size: 16px
  text-transform: uppercase
  letter-spacing: 0.24em

.stories-close
  display: block
  width: 32px
  height: 32px

.stories-close svg
  stroke: var(--color-text)

.story-img
  will-change: transform
  position: relative
  width: mix(3)
  &::before
    content: ''
    display: block
    width: 100%
    padding-bottom: 175.65%
    // background: var(--color-text)

.story-img__i
  position: absolute
  top: 0
  left: 0

  width: 100%
  height: 100%
  object-fit: cover

.swiper-slide
  transition: transform 0.25s cubic-bezier(0.645, 0.045, 0.355, 1)
  width: auto
  .story-img
    margin-left: 1vw
    margin-right: 1vw

.swiper-slide:not(.swiper-slide-active)
  transform: scale(0.89)

.swiper-slide-active
  transform: scale(1)

.stories-link
  &--prev
  &--next
</style>
