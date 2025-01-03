<template>
    <div class="card mb-4 shadow-lg border border-secondary" v-if="pokemon" @click="$emit('click', pokemon)">
      <img :src="pokemon.sprite_url" alt="" class="card-img-top" v-if="!back">
      <img :src="pokemon.sprite_back_url" alt="" class="card-img-top" v-if="back">
      <div class="row">
        <div class="col-6" v-for="(type, i) in pokemon.types" :key="i">
          <TypeComponent :pokemonType="type"/>
        </div>
      </div>
    </div>
    <div class="card mb-4 shadow-lg border border-secondary"  v-if="!pokemon">
      <img src="https://static.wikia.nocookie.net/bec6f033-936d-48c5-9c1e-7fb7207e28af/scale-to-width/32" alt="" class="card-img-top">
    </div>
</template>

<script>
import TypeComponent from "./TypeComponent";

export default {
  name: "PokemonCard",
  emits: ['click'],
  components: {
    TypeComponent
  },
  props: {
    pokemon: {
      type: Object,
      required: false
    },
    back: {
      type: Boolean,
      required: false
    }
  },
}
</script>

<style scoped>

</style>