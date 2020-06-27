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
      <swiper-slide
        v-for="(story, i) in project.fields.stories"
        :key="story.sys.id"
      >
        <div class="story-img" @click="onSlideClick($event, i)">
          <img
            v-if="isImage(story)"
            :src="getImageUrl(story)"
            :alt="story.fields.title"
            class="story-img__i"
          />
          <video
            v-if="isVideo(story)"
            :src="story.fields.file.url"
            class="story-img__i"
            muted
            autoplay
            playsinline
            loop
          />
        </div>
      </swiper-slide>

      <swiper-slide>
        <div
          class="story-img"
          @click="onSlideClick($event, project.fields.stories.length)"
        >
          <a
            ref="link"
            :class="{
              'long-text':
                project.fields.url.replace(/(^\w+:|^)\/\//, '').length > 35
            }"
            :href="project.fields.url"
            target="_blank"
            @click.prevent
          >
            <span>{{ project.fields.url.replace(/(^\w+:|^)\/\//, '') }}</span>
          </a>
        </div>
      </swiper-slide>
    </swiper>

    <template v-if="mounted">
      <router-link
        :class="['stories-link stories-link--prev', { nonclick: !showPrev }]"
        :to="`/case/${prevCase.fields.slug}`"
      >
        <div :class="['stories-link__inner', { hidden: !showPrev }]">
          <div class="stories-link__rect"></div>
          <span class="stories-link__text">
            <svg
              width="6"
              height="10"
              viewBox="0 0 6 10"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M6 5L-1.36151e-06 9.33013L-9.82955e-07 0.669872L6 5Z"
                fill="var(--color-text)"
              />
            </svg>
            <span>Previous</span>
          </span>
        </div>
      </router-link>

      <router-link
        :class="['stories-link stories-link--next', { nonclick: !showNext }]"
        :to="`/case/${nextCase.fields.slug}`"
      >
        <div :class="['stories-link__inner', { hidden: !showNext }]">
          <div class="stories-link__rect"></div>
          <span class="stories-link__text">
            <span>Next</span>
            <svg
              width="6"
              height="10"
              viewBox="0 0 6 10"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M6 5L-1.36151e-06 9.33013L-9.82955e-07 0.669872L6 5Z"
                fill="var(--color-text)"
              />
            </svg>
          </span>
        </div>
      </router-link>
    </template>
  </section>
</template>

<script>
import 'swiper/dist/css/swiper.css'
import { swiper, swiperSlide } from 'vue-awesome-swiper'
import { mapGetters } from 'vuex'

import { isImage, isVideo, getImageUrl } from '@/scripts/helpers'

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
      grabCursor: true
    },
    mounted: false
  }),
  computed: {
    project() {
      return this.cases.length > 0
        ? this.cases.find(el => el.fields.slug === this.$route.params.id)
        : null
    },
    prevCase() {
      const currentCaseIndex = this.cases.indexOf(this.project)

      return currentCaseIndex === 0
        ? this.cases[this.cases.length - 1]
        : this.cases[currentCaseIndex - 1]
    },
    nextCase() {
      const currentCaseIndex = this.cases.indexOf(this.project)

      return currentCaseIndex === this.cases.length - 1
        ? this.cases[0]
        : this.cases[currentCaseIndex + 1]
    },
    showPrev() {
      return this.$refs.swiper && this.$refs.swiper.swiper.activeIndex === 0
    },
    showNext() {
      return (
        this.$refs.swiper &&
        this.$refs.swiper.swiper.activeIndex ===
          this.project.fields.stories.length
      )
    },
    ...mapGetters(['cases'])
  },
  methods: {
    onSlideClick(e, i) {
      const { swiper } = this.$refs.swiper
      if (
        i === this.project.fields.stories.length &&
        i === swiper.activeIndex
      ) {
        window.open(this.$refs.link.href)
      } else {
        swiper.slideTo(i)
      }
    },
    getImageUrl,
    isImage,
    isVideo
  },
  mounted() {
    this.mounted = true
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
  top: var(--unit-v)
  padding: 0 var(--unit-h)

.stories-section
  z-index: 3
  position: fixed
  top: 0
  left: 0
  right: 0
  bottom: 0

  overflow: hidden
  display: flex
  align-items: center
  justify-content: center
  width: 100vw
  height: 100vh
  height: calc(var(--vh, 1vh) * 100)

  @media (min-width: 1000px) and (max-width: 1440px) and (max-height: 700px)
    align-items: flex-end
    padding-bottom: calc(var(--unit-v) / 2)

  @media (max-width: 500px)
    padding-top: 40px
  // @media (max-width: 500px)
  //   align-items: flex-start
  //   padding-top: 96px

.stories-caption
  +eng(b)
  font-size: 16px
  text-transform: uppercase
  letter-spacing: 0.24em

.stories-close
  display: block
  width: 32px
  height: 32px

  @media (max-width: 500px)
    width: 24px
    height: 24px

.stories-close svg
  stroke: var(--color-text)
  @media (max-width: 500px)
    width: 24px
    height: 24px

.story-img
  will-change: transform
  position: relative
  width: mix(3)
  &::before
    content: ''
    display: block
    width: 100%
    padding-bottom: 175.65%
    @media (max-width: 500px)
      padding-bottom: 160%
      // padding-bottom: 180%

  @media (max-width: 500px)
    width: calc(100vw - (4 * var(--unit-h)))

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

  @media (max-width: 500px)
    transition: transform 0.2s ease

  .story-img
    margin-left: 1vw
    margin-right: 1vw
    @media (max-width: 500px)
      margin-left: 0.27vw
      margin-right: 0.27vw

.swiper-slide:not(.swiper-slide-active)
  transform: scale(0.89)
  @media (max-width: 500px)
    transform: scale(0.855)

.swiper-slide-active
  transform: scale(1)

.swiper-slide:last-child
  .story-img::before
    background: var(--color-bg)
  a
    border: 1px solid var(--color-text)

    z-index: 1
    position: absolute
    top: 50%
    left: 50%
    transform: translate(-50%, -50%)

    width: 99%
    height: 99%
    display: flex
    align-items: center
    justify-content: center

    span
      +eng(b)
      font-size: 16px
      text-transform: uppercase
      letter-spacing: 0.2em

      transform: rotate(-180deg)
      writing-mode: vertical-lr
      @media (max-width: 1440px)
        font-size: 14px

    &.long-text span
      font-size: 14px
      @media (max-width: 1440px)
        font-size: 12px

.stories-link
  z-index: 1
  position: absolute
  top: 50%
  transition: transform 0.3s ease
  opacity: 0

  @media (min-width: 1000px) and (max-width: 1440px) and (max-height: 700px)
    top: unset
    bottom: calc(var(--unit-v) / 2)

  &.nonclick
    pointer-events: none

  @media (max-width: 500px)
    top: 52%

  &:hover
    @media (min-width: 501px)
      transform: translate(0, -50%)

    @media (min-width: 1000px) and (max-width: 1440px) and (max-height: 700px)
      transform: translate(0, 0)

    // @media (max-width: 500px)
    //   transform: translate(0, 0)

  svg
    margin-top: 2px

  &--prev
    left: 0
    transform: translate(calc(-1 * var(--unit-h)), -50%)

    @media (min-width: 1000px) and (max-width: 1440px) and (max-height: 700px)
      transform: translate(calc(-1 * var(--unit-h)), 0)

    @media (max-width: 500px)
      transform: translate(calc(-1 * var(--unit-h)), -50%)

    svg
      margin-right: 8px
      transform: scale(-1, 1)
      @media (max-width: 500px)
        margin: 0

    .stories-link__rect
      margin-right: var(--unit-h)

      @media (max-width: 500px)
        margin: 0

    .stories-link__text
      @media (max-width: 500px)
        transform: translateX(calc(-1 * var(--unit-h) + 8px))

  &--next
    right: 0
    transform: translate(var(--unit-h), -50%)

    @media (min-width: 1000px) and (max-width: 1440px) and (max-height: 700px)
      transform: translate(var(--unit-h), 0)

    @media (max-width: 500px)
      transform: translate(calc(var(--unit-h)), -50%)

    svg
      margin-left: 8px
      @media (max-width: 500px)
        margin: 0

    .stories-link__rect
      margin-left: var(--unit-h)

      @media (max-width: 500px)
        margin: 0

    .stories-link__text
      @media (max-width: 500px)
        transform: translateX(calc(var(--unit-h) - 8px))

    .stories-link__inner
      flex-direction: row-reverse

.stories-link__inner
  display: flex
  align-items: center
  transition: opacity 0.25s ease
  &.hidden
    opacity: 0
    pointer-events: none

.stories-link__text
  +eng(b)
  font-size: 14px
  text-transform: uppercase
  letter-spacing: 0.16em

  display: flex
  align-items: center

  span
    @media (max-width: 500px)
      display: none

.stories-link__rect
  width: calc(2 * var(--unit-h))
  height: 41.714vw
  background: var(--color-text)
  // background: #fff
  opacity: 0.3

  @media (max-width: 500px)
    height: 101.7vw
</style>
