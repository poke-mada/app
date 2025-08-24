<template>
  <div class="d-flex flex-row align-items-center justify-center">
    <img class="mr-2 mt-1 mb-1" :src="get_asset()" height="32" width="32" />
  </div>
</template>

<script>

export default {
  name: "ExpComponent",
  props: {
    stealable: {
      type: Boolean,
      required: false
    }
  },
  methods: {
    get_asset() {
      if (!this.stealable) {
        return './assets/shields/shield-master.png'
      }

      return './assets/shields/shield-poke.png'
    },
  },
}
</script>

<style scoped>
</style>