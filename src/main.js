import Vue from 'vue'
import App from '@/App.vue'

import router from '@/router'
import store from '@/store/'
import { fetchCases } from '@/scripts/api'
import '@/scripts/css-props'

import '@/sass/main.sass'
import anime from 'animejs'
window.anime = anime

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App),
  created() {
    fetchCases(this)
  }
}).$mount('#app')
