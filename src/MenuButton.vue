<template>
  <button :class="['menu-btn', { active, hidden }]" @click="$emit('click')">
    <span class="menu-btn__circle"></span>
    <span class="menu-btn__circle"></span>
    <span class="menu-btn__circle"></span>
    <span class="menu-btn__circle"></span>
  </button>
</template>

<script>
export default {
  name: 'MenuButton',
  props: {
    active: Boolean,
    hidden: Boolean
  }
}
</script>

<style lang="sass" scoped>
.menu-btn
  display: flex
  flex-wrap: wrap

  width: 24px
  height: 24px
  margin-left: -4px
  margin-top: -4px

  transition: transform 0.25s ease-in-out, opacity 0.25s ease
  transform-origin: 50% 50%

.menu-btn:hover
  opacity: 0.3

.menu-btn.active
  transform: rotate(45deg)

.menu-btn__circle:nth-child(2)
  margin-right: 30%

.menu-btn:not(.active) .menu-btn__circle
  background: var(--color-text)

.menu-btn.active .menu-btn__circle
  background: #fff

.menu-btn__circle
  border-radius: 50%
  width: 4px
  height: 4px
  margin-left: 4px
  margin-top: 4px
</style>