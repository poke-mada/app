<!--suppress JSVoidFunctionReturnValueUsed -->
<template>
  <v-tooltip location="top">
    <template v-slot:activator="{ props }">
      <v-alert v-bind="props" class="containerMovPokeBattle pa-1" :class="stab ? 'golden' : ''" rounded="pill" elevation="1">
        <v-row align="center" no-gutters>
          <!-- Tipo -->
          <v-col cols="auto">
            <v-img :src="type_image_path" width="32" height="32" />
          </v-col>

          <!-- Nombre del movimiento -->
          <v-col class="text-start font-weight-bold">
            {{ movement.name }}
          </v-col>

          <!-- Categoría (si no es status) -->
          <v-col cols="auto">
            <v-img :src="getCategoryIcon(category)" width="32" height="32" :title="category" class="ml-2 imgTypeMov" />
          </v-col>
        </v-row>
      </v-alert>
    </template>

    <v-container class="informationMov">
      <v-row>
        <v-col cols="12">
          {{ movement.flavor_text }}
        </v-col>
        <v-col cols="12">
          <!-- TODO: se overlapean los badges -->
          <v-badge v-if="movement.power !== -1" color="error" :content="`Power: ${movement.power}`" inline />
          <v-badge v-else color="error" content="Power: -" inline />
          <v-badge v-if="movement.accuracy !== -1" color="info" :content="`Accuracy: ${movement.accuracy}%`" inline />
          <v-badge v-else color="info" content="Accuracy: -" inline />
        </v-col>
      </v-row>
    </v-container>
  </v-tooltip>
</template>

<script>
import {get_ability, get_types} from "@/data/mon_functions";


export default {
  name: "MovementCard",
  components: [],
  props: {
    pokemon: {
      type: Object,
      required: true
    },
    movement: {
      type: Object,
      required: true
    },
  },
  methods: {
    getCategoryIcon(category) {
      const lower = category.toLowerCase();
      if (lower === 'fisico') return './imgs/physical_move.png';
      if (lower === 'especial') return './imgs/special_move.png';
      if (lower === 'status') return './imgs/status_move.png';
      return null;
    },
  },
  computed: {
    move_type() {
      if (this.forced_type) {
        return this.forced_type
      }
      return this.movement.move_type
    },
    type_image_path() {
      return `./assets/types/Types/${this.movement.move_type}.png`;
    },
    category() {
      switch (this.movement.category) {
        case 'Non-Damaging':
          return 'Status';
        case 'Physical':
          return 'Fisico';
        case 'Special':
          return 'Especial';
        default:
          return 'None';
      }
    },
    pokemon_types() {
      return get_types(this.pokemon)
    },
    stab() {
      if (this.category === 'Status') {
        return false;
      }
      if (get_ability(this.pokemon) === 168) { // PROTEAN
        return true;
      }
      try {
        let this_type = this.movement.move_type.toLowerCase();
        let pokemon_types = this.pokemon_types.map((item) => item.name.toLowerCase());
        return !!pokemon_types.includes(this_type);
      } catch (e) {
        return false;
      }
    }
  },
  data() {
    return {
      display_tooltip: false
    }
  }
}
</script>

<style scoped>
.golden {
  background: #daa52050;
}
</style>
