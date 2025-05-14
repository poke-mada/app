<template>
  <v-tooltip location="bottom">
    <template v-slot:activator="{props}">
      <v-row>
        <v-col>
          <img :src="pokemon ? get_sprite() : missingno" width="70" alt="" :class="this.selected ? 'bordered' : ''"
               @click="$emit('click', pokemon)" v-bind="props" class="cursor-pointer"/>
          <v-badge color="error" dot bordered location="bottom right" v-if="pokemon && pokemon.held_item_name !== 'None'">
          </v-badge>
        </v-col>
      </v-row>
    </template>
    {{ pokemon ? pokemon.mote : '' }}
  </v-tooltip>
</template>

<script>
import {get_form, get_sprite as _get_sprite} from "@/data/mon_functions";

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
  methods: {
    get_sprite() {
      const form = get_form(this.pokemon)
      return _get_sprite(this.pokemon.dex_number, form)
    },
  },
  created() {
  },
  data() {
    return {
      missingno: 'https://static.wikia.nocookie.net/bec6f033-936d-48c5-9c1e-7fb7207e28af'
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
