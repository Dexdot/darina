<template>
  <section class="cases">
    <ul class="cases-list">
      <li
        ref="cases"
        class="cases-li"
        v-for="(project, i) in sortedCases"
        :key="project.sys.id"
      >
        <router-link
          :class="[
            'case',
            { 'case--faded': image.visible && i !== titleIndex }
          ]"
          :to="`/case/${project.fields.slug}`"
          @mouseover.native="onMouseover({ fields: project.fields, i }, $event)"
          @mouseout.native="onMouseout"
        >
          <sup class="case__sup case__sup--soon" v-if="project.fields.soon"
            >soon</sup
          >
          <sup class="case__sup case__sup--year" v-else>{{
            project.fields.year
          }}</sup>
          {{ project.fields.title }}</router-link
        >
      </li>
    </ul>
    <div
      :class="['case__img-w', ...image.classes]"
      v-show="image.visible"
      :style="{ transform: `translate3d(0, ${scroll}px, 0)` }"
    >
      <img class="case__img" :src="image.src" :alt="image.alt" />
    </div>
  </section>
</template>

<script>
import { getCases } from '@/scripts/api'

export default {
  name: 'Main',
  props: { scroll: { type: Number, default: 0 } },
  data: () => ({
    titleIndex: 0,
    cases: [],
    image: { visible: false, src: '', alt: '', classes: [] }
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
    }
  },
  async mounted() {
    this.cases = await getCases(this)
    this.$nextTick(() => {
      this.observe()
    })
  },
  methods: {
    onMouseover({ fields, i }, { target }) {
      const { preview } = fields

      // Set preview image
      this.image = {
        visible: true,
        src: preview.fields.file.url,
        alt: preview.fields.title,
        classes: this.getCaseClasses(fields)
      }
      this.titleIndex = i

      // Active title
      target.classList.add('active')

      this.$emit('case-mouseover', fields.fullscreen)
    },
    onMouseout({ target }) {
      this.image.visible = false

      // Active title
      target.classList.remove('active')

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
  padding-top: 48px
  padding-bottom: 48px
  padding-left: var(--unit)
  padding-right: var(--unit)

  @media (max-width: 700px)
    padding-top: 176px
    padding-bottom: 120px

.cases-list
  display: flex
  flex-direction: column
  align-items: flex-end

.cases-li
  display: inline-flex
  text-align: right
  &:not(:last-child)
    margin-bottom: 4px

    @media (max-width: 500px)
      margin-bottom: 8px

.case
  line-height: 1
  +yo('font-size', (320px: 40px, 375px: 48px, 1920px: 96px))

  transition: opacity 0.25s ease

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

.case.active .case__sup
  opacity: 1

  @media (max-width: 500px)
    opacity: 0.35

.case__img-w
  z-index: -1
  position: fixed
  pointer-events: none

.case__img
  display: block
  max-width: 100%
  height: auto
  @media (max-width: 500px)
    display: none

.case__img--fullscreen
  top: 0
  left: 0

  .case__img
    object-fit: cover

  &::before
    z-index: 1
    content: ''
    background: rgba(#000, 0.2)

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
      width: calc(#{column-spans(5)} + #{var(--unit)})

  &.case__img--2
    top: 50vh
    top: calc(var(--vh, 1vh) * 50)
    left: 50vw
    .case__img
      width: column-spans(6)
      transform: translate(-50%, -50%)

  &.case__img--3
    top: 0
    left: calc(#{mix(2)} + #{var(--unit)})
    .case__img
      width: column-spans(5)

  &.case__img--4
    top: 85.2vh
    top: calc(var(--vh, 1vh) * 85.2)
    left: calc(#{mix(1)} + #{var(--unit)})
    .case__img
      width: column-spans(5)
      transform: translateY(-100%)


.case__img--even
  &.case__img--1
    top: 14.8vh
    top: calc(var(--vh, 1vh) * 14.8)
    left: calc(#{mix(1)} + #{var(--unit)})
    .case__img
      width: column-spans(5)

  &.case__img--2
    top: 50vh
    top: calc(var(--vh, 1vh) * 50)
    left: 50vw
    .case__img
      width: gutter-spans(4)
      transform: translate(-50%, -50%)

  &.case__img--3
    top: 100vh
    top: calc(var(--vh, 1vh) * 100)
    left: 50vw
    .case__img
      width: column-spans(5)
      transform: translate(-50%, -100%)

  &.case__img--4
    top: 50vh
    top: calc(var(--vh, 1vh) * 50)
    left: 0
    .case__img
      width: column-spans(6)
      transform: translate(0, -50%)

// ANIMATION
.cases-li
  overflow: hidden
.case
  transform: translate3d(0, 200%, 0)
  transition: transform 1.4s cubic-bezier(.25,.75,.34,.98)
.cases-li.visible .case
  transform: translate3d(0, 0%, 0)
</style>