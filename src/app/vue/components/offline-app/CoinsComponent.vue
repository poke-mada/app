<!--suppress HtmlRequiredAltAttribute -->
<template>
  <!--  TODO: economy transactions log screen -->
  <img class="mr-2" :src="get_coin_asset()" height="16" width="16" style="display: inline"/>
  <span class="mr-2">{{ coins }}</span>
</template>

<script>
export default {
  name: "CoinsComponent",
  props: {
    disabled: {
      type: Boolean,
      required: false
    },
    coins: {
      type: Number,
      required: true
    }
  },
  methods: {
    get_coin_asset() {
      return './assets/coin.gif'
    },
  },
  data() {
    return {}
  }
}
</script>

<style scoped>

</style>
