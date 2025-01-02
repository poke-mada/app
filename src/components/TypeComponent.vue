<template>
  <main>
    <img class="w-100" :src="`./assets/types/${pokemonType.name}.png` " alt="">
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