<template>
  <v-img class="mr-2" :content-class="disabled ? '' : ''" src="./assets/coin.gif" max-height="16" max-width="16"></v-img>
  <span class="mr-2" :class="disabled ? 'text-disabled' : ''">{{ coins }}</span>
</template>

<script>
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
      coins: 6,
    }
  }
}
</script>

<style scoped>

</style>