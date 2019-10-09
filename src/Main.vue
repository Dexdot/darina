<template>
  <section class="cases">
    <ul class="cases-list">
      <li
        ref="cases"
        class="cases-li"
        v-for="(project, i) in sortedCases"
        :key="project.sys.id"
      >
        <p
          v-if="project.fields.soon"
          :class="[
            'case',
            { 'case--faded': titleIndex !== i && titleIndex !== -1 }
          ]"
          @mouseover="onMouseover({ fields: project.fields, i })"
          @mouseout="onMouseout"
        >
          <sup class="case__sup case__sup--soon">soon</sup>
          {{ project.fields.title }}
        </p>
        <router-link
          v-else
          :class="[
            'case',
            { 'case--faded': titleIndex !== i && titleIndex !== -1 }
          ]"
          :to="`/case/${project.fields.slug}`"
          @mouseover.native="onMouseover({ fields: project.fields, i })"
          @mouseout.native="onMouseout"
        >
          <sup class="case__sup case__sup--year">{{ project.fields.year }}</sup>
          {{ project.fields.title }}</router-link
        >
      </li>
    </ul>

    <template v-if="images && images.length > 0">
      <div
        v-for="(img, i) in images"
        :key="img.src + i"
        :class="[
          'case__img-w',
          ...img.classes,
          { visible: img.i === titleIndex }
        ]"
        :style="{ transform: `translate3d(0, ${scroll}px, 0)` }"
      >
        <div class="u-ovh">
          <img class="case__img" :src="img.src" :alt="img.alt" />
        </div>
      </div>
    </template>
  </section>
</template>

<script>
import { getCases } from '@/scripts/api'

export default {
  name: 'Main',
  props: { scroll: { type: Number, default: 0 } },
  data: () => ({
    titleIndex: -1,
    cases: []
  }),
  computed: {
    sortedCases() {
      let second = false
      let c = 0

      return this.cases.map(el => {
        if (!el.fields.fullscreen) {
          if (c >= 3) {
            el.fields.even = second
            el.fields.nthChild = c + 1
            c = 0
            second = !second
          } else {
            c += 1
            el.fields.even = second
            el.fields.nthChild = c
          }
        } else {
          c = 0
          second = !second
        }
        return el
      })
    },
    images() {
      return this.sortedCases.map(({ fields }, i) => ({
        src: fields.preview.fields.file.url,
        alt: fields.preview.fields.title,
        classes: this.getCaseClasses(fields),
        i
      }))
    }
  },
  async mounted() {
    this.cases = await getCases(this)
    this.$nextTick(() => {
      this.observe()
    })
  },
  methods: {
    onMouseover({ fields, i }) {
      this.titleIndex = i
      this.$emit('case-mouseover', fields.fullscreen)
    },
    onMouseout() {
      this.titleIndex = -1
      this.$emit('case-mouseout')
    },
    getCaseClasses(fields) {
      const classes = []

      if (fields.fullscreen) {
        classes.push('case__img--fullscreen')
      } else {
        classes.push(fields.even ? 'case__img--even' : 'case__img--odd')
        classes.push(`case__img--${fields.nthChild}`)
      }

      return classes
    },
    observe() {
      const observer = new IntersectionObserver(entries => {
        entries.forEach(({ target, isIntersecting }) => {
          if (isIntersecting) {
            target.classList.add('visible')
            const i = Array.from(target.parentElement.children).indexOf(target)
            observer.unobserve(this.$refs.cases[i])
          }
        })
      })

      this.$refs.cases.forEach(c => {
        observer.observe(c)
      })
    }
  }
}
</script>

<style lang="sass" scoped>
@import "~@/sass/utils"

.cases
  padding-top: var(--unit-v)
  padding-bottom: var(--unit-v)
  padding-left: var(--unit-h)
  padding-right: var(--unit-h)

  @media (max-width: 700px)
    padding-top: 176px
    padding-bottom: 120px

  @media (max-width: 500px)
    padding-bottom: 0

.cases .next
  margin-left: calc(var(--unit-h) * -1)

.cases-list
  display: flex
  flex-direction: column
  align-items: flex-end

  @media (max-width: 500px)
    padding-bottom: 120px

.cases-li
  padding-top: 0.15em
  padding-bottom: 0.325em
  display: inline-flex
  text-align: right

.is-mob .cases-li,
.is-macos .cases-li
  padding-top: 0.35em

.case
  line-height: 1
  +yo('font-size', (320px: 40px, 375px: 48px, 1920px: 96px))

.case--faded:not(.active)
  opacity: 0.35

.case__sup
  +yo('font-size', (375px: 12px, 1920px: 22px))
  letter-spacing: 0

  left: 0.6em
  top: 0.25em
  vertical-align: top
  transition: opacity 0.25s ease
  opacity: 0

  @media (max-width: 500px)
    opacity: 0.35

.case:hover .case__sup
  opacity: 1

  @media (max-width: 500px)
    opacity: 0.35

.case__img-w
  z-index: -1
  position: fixed

  // overflow: hidden
  transition: opacity 0.3s ease
  pointer-events: none
  opacity: 0

  &.visible
    opacity: 1

    .case__img
      transform: scale(1)

.case__img
  transition: transform 1.6s cubic-bezier(0.215, 0.61, 0.355, 1)
  transform: scale(1.2)

  display: block
  max-width: 100%
  height: auto
  @media (max-width: 500px)
    display: none

// Image sizes
.case__img--fullscreen
  top: 0
  left: 0

  .case__img
    object-fit: cover
    transform: scale(1.1)

  &::before
    z-index: 1
    content: ''
    background: rgba(#000, 0.2)
    @media (max-width: 500px)
      display: none

  &::before,
  .case__img
    position: absolute
    top: 0
    left: 0

    min-width: 100vw
    width: 100vw
    height: 100vh
    height: calc(var(--vh, 1vh) * 100)


.case__img--odd
  &.case__img--1
    top: 14.8vh
    top: calc(var(--vh, 1vh) * 14.8)
    left: 0

    .case__img
      width: calc(#{column-spans(5)} + #{var(--unit-h)})

  &.case__img--2
    top: 50vh
    top: calc(var(--vh, 1vh) * 50)
    left: 50vw

    .case__img
      width: column-spans(6)

    .u-ovh
      transform: translate(-50%, -50%)

  &.case__img--3
    top: 0
    left: calc(#{mix(2)} + #{var(--unit-h)})

    .case__img
      width: column-spans(5)

  &.case__img--4
    top: 85.2vh
    top: calc(var(--vh, 1vh) * 85.2)
    left: calc(#{mix(1)} + #{var(--unit-h)})

    .case__img
      width: column-spans(5)

    .u-ovh
      transform: translateY(-100%)


.case__img--even
  &.case__img--1
    top: 14.8vh
    top: calc(var(--vh, 1vh) * 14.8)
    left: calc(#{mix(1)} + #{var(--unit-h)})

    .case__img
      width: column-spans(5)

  &.case__img--2
    top: 50vh
    top: calc(var(--vh, 1vh) * 50)
    left: 50vw

    .case__img
      width: gutter-spans(4)

    .u-ovh
      transform: translate(-50%, -50%)

  &.case__img--3
    top: 100vh
    top: calc(var(--vh, 1vh) * 100)
    left: 50vw

    .case__img
      width: column-spans(5)

    .u-ovh
      transform: translate(-50%, -100%)

  &.case__img--4
    top: 50vh
    top: calc(var(--vh, 1vh) * 50)
    left: 0

    .case__img
      width: column-spans(6)

    .u-ovh
      transform: translate(0, -50%)

// ANIMATION
.cases-li
  overflow: hidden
.case
  transform: translate3d(0, 200%, 0)
  transition: transform 1.4s cubic-bezier(.25,.75,.34,.98), opacity 0.25s ease
.cases-li.visible
  .case
    transform: translate3d(0, 0%, 0)
</style>
