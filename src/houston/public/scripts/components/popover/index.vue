/**
 * houston/public/scripts/components/popover/index.js
 * Creates a Vue popover component
 *
 * @exports {Object} default - Vue popover component
 */

<script>
  export default {
    props: {
      /**
       * placement
       * Holds the cardinal direction the popup will appear
       * north, east, south, west
       *
       * @type {String}
       */
      placement: {
        type: String,
        default: 'south'
      }
    },

    data () {
      return {
        show: false
      }
    },

    methods: {
      /**
       * toggle
       * Toggles the visibility of content
       *
       * @param {Event} e - an event object
       * @return {Void}
       */
      toggle (e) {
        this.show = !this.show
      }
    },

    computed: {
      /**
       * classes
       * Returns an object of class names to be applied to root ele-popover
       *
       * @return {Object} - key of class names to apply to object
       */
      classes () {
        return {
          'ele-popover--active': this.show,
          [`ele-popover--${this.placement}`]: true
        }
      }
    }
  }
</script>

<template lang="pug">
  div.ele-popover(v-bind:class="classes")
    div.ele-popover__trigger(v-on:click="toggle")
      slot(name="trigger")
    div.ele-popover__wrapper(v-show="show")
      div.ele-popover__content
        slot(name="content")
</template>

<style lang="postcss">
  .ele-popover {
    display: inline-block;
    position: relative;
  }

  .ele-popover__content {
    overflow: auto;
  }

  .ele-popover__wrapper {
    background-clip: padding-box;
    background-color: #fafafa;
    border-radius: 3px;
    border: 1px solid rgba(0, 0, 0, 0.4);
    box-shadow: 0 0 30px rgba(0, 0, 0, 0.2);
    box-sizing: border-box;
    display: block;
    max-height: 100vh;
    max-width: 100vw;
    min-height: 100%;
    min-width: 100%;
    overflow: visible;
    position: absolute;
    word-wrap: break-word;
    z-index: 80;
  }

  .ele-popover__wrapper::before,
  .ele-popover__wrapper::after {
    border: transparent outset 10px;
    content: "";
    display: block;
    height: 0;
    left: 50%;
    margin: -10px;
    position: absolute;
    top: 50%;
    width: 0;
  }

  .ele-popover--north .ele-popover__wrapper {
    bottom: 100%;
    left: 0;
    margin-bottom: 10px;
    right: 0;
  }

  .ele-popover--north .ele-popover__wrapper::before {
    border-top: 10px solid rgba(0, 0, 0, 0.4);
    top: calc(100% + 10px);
  }

  .ele-popover--north .ele-popover__wrapper::after {
    border-top: 10px solid #fafafa;
    top: calc(100% + 9px);
  }

  .ele-popover--east .ele-popover__wrapper {
    bottom: 0;
    left: 100%;
    margin-left: 10px;
    top: 0;
  }

  .ele-popover--east .ele-popover__wrapper::before {
    border-right: 10px solid rgba(0, 0, 0, 0.4);
    left: -10px;
  }

  .ele-popover--east .ele-popover__wrapper::after {
    border-right: 10px solid #fafafa;
    left: -9px;
  }

  .ele-popover--south .ele-popover__wrapper {
    top: 100%;
  }

  .ele-popover--south .ele-popover__wrapper::before {
    border-bottom: 10px solid rgba(0, 0, 0, 0.4);
    top: -10px;
  }

  .ele-popover--south .ele-popover__wrapper::after {
    border-bottom: 10px solid #fafafa;
    top: -9px;
  }

  .ele-popover--west .ele-popover__wrapper {
    right: 100%;
  }

  .ele-popover--west .ele-popover__wrapper::before {
    border-left: 10px solid rgba(0, 0, 0, 0.4);
    left: 10px;
  }

  .ele-popover--west .ele-popover__wrapper::after {
    border-left: 10px solid #fafafa;
    left: 9px;
  }
</style>
