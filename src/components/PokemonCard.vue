<template>
  <img :src="pokemon ? pokemon.sprite_url : missingno" class="img-thumbnail" width="96" alt="" @click="$emit('click', pokemon)" style="display: inline">
</template>

<script>
export default {
  name: "PokemonCard",
  emits: ['click'],
  components: {},
  props: {
    pokemon: {
      type: Object,
      required: false
    }
  },
  data() {
    return {
      missingno: 'https://static.wikia.nocookie.net/bec6f033-936d-48c5-9c1e-7fb7207e28af'
    }
  }
}
</script>

<style scoped>

</style>