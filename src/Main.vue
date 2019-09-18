<template>
  <section class="cases">
    <ul class="cases-list">
      <li class="cases-li" v-for="project in sortedCases" :key="project.sys.id">
        <router-link
          class="case"
          :to="`/case/${project.fields.slug}`"
          @mouseover.native="onMouseover(project.fields)"
          @mouseout.native="onMouseout(project.fields)"
        >
          <sup class="case__sup" v-if="project.fields.soon">soon</sup>
          <sup class="case__sup" v-else>{{ project.fields.year }}</sup>
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
  async created() {
    this.cases = await getCases(this)
  },
  methods: {
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
    onMouseover(fields) {
      const { preview } = fields

      this.image = {
        visible: true,
        src: preview.fields.file.url,
        alt: preview.fields.title,
        classes: this.getCaseClasses(fields)
      }

      if (fields.fullscreen) {
        document.querySelector('#app').classList.add('case-fullscreen')
      }
    },
    onMouseout() {
      this.image.visible = false
      document.querySelector('#app').classList.remove('case-fullscreen')
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

.case
  line-height: 1
  +yo('font-size', (375px: 48px, 1920px: 96px))

.case__sup
  font-size: 12px
  letter-spacing: 0

  left: 0.6em
  top: 1.2em
  vertical-align: top

  display: none
  @media (max-width: 500px)
    display: block

.case__img-w
  position: fixed
  pointer-events: none

.case__img
  display: block
  max-width: 100%
  height: auto

.case__img--fullscreen
  z-index: -1
  top: 0
  left: 0
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
</style>
