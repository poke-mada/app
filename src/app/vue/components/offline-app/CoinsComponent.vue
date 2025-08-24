<!--suppress HtmlRequiredAltAttribute -->
<template>
  <div class="d-flex flex-row align-items-center">
    <img class="mr-2 mt-1 mb-1" :src="get_coin_asset()" height="16" width="16" />
    <span class="mr-2">{{ coins }}</span>
  </div>
</template>

<script>
import {emitter} from "@/stores";

export default {
  name: "CoinsComponent",
  props: {
    disabled: {
      type: Boolean,
      required: false
    }
  },
  data() {
    return {
      coins: 0,
    }
  },
  methods: {
    get_coin_asset() {
      return './assets/coin.png'
    },
  },
  async mounted() {
    emitter.on('coins_updated', (data) => {
      this.coins = data
    })
  },
}
</script>

<style scoped>
 * {
   /*border: 1px solid red;*/
 }
</style>
