<template>
  <v-tooltip location="bottom">
    <template v-slot:activator="{props}">
      <img :src="pokemon ? pokemon.sprite_url : missingno" width="70" alt="" :class="this.selected ? 'bordered' : ''"
           @click="$emit('click', pokemon)" v-bind="props" class="cursor-pointer"/>
      <v-badge color="error" dot bordered location="bottom right" v-if="pokemon && pokemon.held_item_num && pokemon.held_item_num !== '0'">
      </v-badge>
    </template>
    {{ pokemon ? pokemon.mote : '' }}
  </v-tooltip>
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
    },
    selected: {
      type: Boolean,
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

.bordered {
  filter: drop-shadow(0 0 0.75rem dodgerblue);
}
</style>