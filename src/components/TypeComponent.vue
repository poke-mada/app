<template>
  <main>
    <img class="w-100" :src="pokemonType.image_url" alt="">
  </main>
</template>

<script>
export default {
  name: "TypeComponent",
  props: {
    pokemonType: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      type_url: ''
    }
  },
}
</script>

<style scoped>

</style>