<!--suppress HtmlRequiredAltAttribute -->
<template>
  <div class="d-flex flex-row align-items-center">
    <img class="mr-2 mt-1 mb-1" :src="get_coin_asset()" height="16" width="16" />
    <span class="mr-2">{{ count }}</span>
  </div>
</template>

<script>
export default {
  name: "WildcardCountComponent",
  props: {
    count: {
      type: Number,
      required: true
    }
  },
  methods: {
    get_coin_asset() {
      return './assets/wildcards.png'
    },
  },
}
</script>

<style scoped>
 * {
   /*border: 1px solid red;*/
 }
</style>
