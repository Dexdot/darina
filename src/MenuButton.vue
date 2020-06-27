<template>
  <button :class="['menu-btn', { active, hidden }]" @click="$emit('click')">
    <div class="menu-btn__inner">
      <span class="menu-btn__circle"></span>
      <span class="menu-btn__circle"></span>
      <span class="menu-btn__circle"></span>
      <span class="menu-btn__circle"></span>
    </div>
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

  width: 40px
  height: 40px

  transition: opacity 0.25s ease
  transform-origin: 50% 50%

.menu-btn:hover
  opacity: 0.3

  @media (max-width: 500px)
    opacity: 1

.menu-btn.active .menu-btn__inner
  transform: rotate(45deg)

.menu-btn:not(.active) .menu-btn__circle
  background: var(--color-text)

.menu-btn.active .menu-btn__circle
  background: #fff

.menu-btn__inner
  transition: transform 0.25s ease-in-out
  transform-origin: 50% 50%

  position: absolute
  top: 0
  right: 0

  display: flex
  flex-wrap: wrap
  width: 12px
  height: 12px

.menu-btn__circle
  border-radius: 50%
  min-width: 4px
  width: 4px
  height: 4px

.menu-btn__circle:nth-child(3),
.menu-btn__circle:nth-child(4)
  margin-top: 4px

.menu-btn__circle:nth-child(1),
.menu-btn__circle:nth-child(3)
  margin-right: 4px
</style>
