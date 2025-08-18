<template>
  <v-tooltip location="bottom" v-if="pokemon">
    <template v-slot:activator="{ props }">
      <div class="badge-container">
        <v-img :src="get_sprite() ? get_sprite() : missingno" width="70" alt=""
          :class="this.selected ? 'bordered' : ''" @click="$emit('click', pokemon)" v-bind="props"
          class="cursor-pointer" />
        <!-- Badge solo si tiene held_item -->
        <v-img v-if="hasHeldItem" src="/assets/img/Home/itemPoke.png" width="22" class="custom-badge" />
      </div>
    </template>
    {{ pokemon ? pokemon.mote : '' }}
  </v-tooltip>
  <v-row v-else>
    <v-col>
      <img :src="missingno" width="70" alt="" :class="this.selected ? 'bordered' : ''" />
    </v-col>
  </v-row>
</template>

<script>
import { get_form, get_sprite as _get_sprite } from "@/data/mon_functions";

export default {
  name: "PokemonCard",
  emits: ['click'],
  components: {},
  props: {
    pokemon: { type: Object, required: false, default: null },
    selected: { type: Boolean, required: false, default: false }
  },
  methods: {
    get_sprite() {
      console.log("pokemon en caja", this.pokemon)
      const form = get_form(this.pokemon)
      return _get_sprite(this.pokemon.dex_number, form)
    },
  },
  computed: {
    spriteSrc() {
      if (!this.pokemon) return this.missingno;
      const form = get_form(this.pokemon);
      return _get_sprite(this.pokemon.dex_number, form) || this.missingno;
    },
    hasHeldItem() {
      return this.pokemon?.held_item >= 1;
    }
  },
  data() {
    return {
      missingno: 'https://res.cloudinary.com/dtattuxue/image/upload/v1753918578/Pokeball_qi5tk3.svg'
    }
  }
}
</script>

<style scoped>
* {
  /*border: 1px solid red;*/
}

.bordered {
  filter: drop-shadow(0 0 0.75rem dodgerblue);
}

.img-thumbnail {
  cursor: pointer;
}
</style>
