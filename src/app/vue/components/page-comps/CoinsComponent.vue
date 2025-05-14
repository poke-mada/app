<template>
  <!--  TODO: economy transactions log screen -->
  <img class="mr-2" src="assets/coin.gif" height="16" width="16" style="display: inline"/>
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
  data() {
    return {}
  }
}
</script>

<style scoped>

</style>