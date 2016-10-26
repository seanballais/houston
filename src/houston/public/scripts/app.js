/**
 * houston/public/scripts/app.js
 * Main entry point for everything client side houston
 */

import Vue from 'vue'

Vue.component('ele-popover', require('./components/popover/index.vue'))

export default new Vue({
  el: '#content-container'
})

// eslint-disable-next-line
console.log('Loaded script')
