<template>
  <section class="cases">
    <ul class="cases-list">
      <li class="cases-li" v-for="project in cases" :key="project.sys.id">
        <router-link class="cases-title" :to="`/case/${project.fields.slug}`">
          <sup v-if="project.fields.soon">soon</sup>
          <sup v-else>{{ project.fields.year }}</sup>
          {{ project.fields.title }}</router-link
        >
      </li>
    </ul>
  </section>
</template>

<script>
import { getCases } from '@/scripts/api'

export default {
  name: 'Main',
  data: () => ({
    cases: []
  }),
  async created() {
    this.cases = await getCases(this)
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

.cases-li
  text-align: right
  &:not(:last-child)
    margin-bottom: 4px

.cases-title
  line-height: 1
  +yo('font-size', (375px: 48px, 1920px: 96px))

  sup
    font-size: 12px
    letter-spacing: 0

    left: 0.6em
    top: 1.2em
    vertical-align: top
</style>
