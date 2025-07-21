<template>
  <v-tooltip location="bottom">
    <template v-slot:activator="{ props }">
      <div class="badge-container">
        <img :src="pokemon ? pokemon.sprite_url : missingno" width="70" alt="" :class="this.selected ? 'bordered' : ''"
             @click="pokemon ? $emit('click', pokemon) : null" v-bind="props" class="cursor-pointer" />
        <!-- Badge solo si tiene held_item -->
        <v-img v-if="pokemon && pokemon.item_name !== 'None'" src="/assets/img/Home/itemPoke.png" width="22" class="custom-badge" />
      </div>
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
.badge-container {
  position: relative;
  width: 70px;
  height: 70px;
}
</style>