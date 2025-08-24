<!--suppress HtmlRequiredAltAttribute -->
<template>
  <div class="d-flex flex-row align-items-center">
    <img class="mr-2 mt-1 mb-1" :src="get_coin_asset()" height="16" width="16" />
    <span class="mr-2">{{ coins }}</span>
  </div>
</template>

<script>
export default {
  name: "CoinsComponent",
  props: {
    coins: {
      type: Number,
      required: false
    },
  },
  methods: {
    get_coin_asset() {
      return './assets/coin.png'
    },
  },
}
</script>

<style scoped>
 * {
   /*border: 1px solid red;*/
 }
</style>
