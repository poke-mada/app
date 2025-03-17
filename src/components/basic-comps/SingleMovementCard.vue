<!--suppress JSVoidFunctionReturnValueUsed -->
<template>
  <v-tooltip location="top">
    <template v-slot:activator="{ props }">
      <v-alert v-bind="props" class="mb-2 w-100 pl-1" :icon="type_image_path">
        <template v-slot:prepend>
          <v-img :src="type_image_path" v-if="movement" width="32" inline></v-img>
        </template>
        <template v-slot:text>
          <v-row>
            <v-col cols="12">
              {{ movement.move_name }}
            </v-col>
          </v-row>
        </template>
        <template v-slot:append>
          <v-row>
            <v-col sm>
              <v-badge bordered :content="category" color="secondary" inline></v-badge>
              <v-badge bordered :content="`x${this.multiplier}`" v-if="this.category !== 'Status' && this.enemy_data"
                       :color="this.multiplier > 1 ? 'success' : this.multiplier < 1 ? 'error' : 'info'" inline></v-badge>
            </v-col>
          </v-row>
        </template>
      </v-alert>
    </template>
    <span>
      <v-row>
        <v-col cols="12">
          {{ movement.flavor_text }}
        </v-col>
        <v-col cols="12">
          <v-badge v-if="movement.power !== -1" color="error" :content="`Power: ${movement.power}`" inline></v-badge>
          <v-badge v-if="movement.power === -1" color="error" content="Power: -" inline></v-badge>
          <v-badge v-if="movement.accuracy !== -1" color="info" :content="`Accuracy: ${movement.accuracy * accuracy_multiplier}%`" inline></v-badge>
          <v-badge v-if="movement.accuracy === -1" color="info" content="Accuracy: -" inline></v-badge>
        </v-col>
      </v-row>
    </span>
  </v-tooltip>
</template>

<script>

function appearances(coverageTypes, enemyTypes) {
  return enemyTypes.filter(item => item.name && coverageTypes.includes(item.name.toLowerCase())).length;
}

export default {
  name: "SingleMovementCard",
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
    enemy_data: {
      type: Object,
      required: false
    },
  },
  methods: {
    get_pokemon_boost(stat) {
      if (!this.pokemon) {
        return 0;
      }
      if (this.pokemon.battle_data) {
        return this.pokemon.battle_data.boosts[stat];
      }
      if (this.pokemon.boosts) {
        return this.pokemon.boosts[stat];
      }
      return 0;
    },
    get_stat_offensive_multiplier(stat) {
      let simplifier = 2;
      let base = simplifier + Math.abs(stat)
      if (stat < 1) {
        return simplifier / base;
      }
      return base / simplifier;
    },
    get_stat_strategical_multiplier(stat) {
      let simplifier = 3;
      let base = simplifier + Math.abs(stat)
      if (stat < 1) {
        return simplifier / base;
      }
      return base / simplifier;
    },
    get_enemy_pokemon(dex_number) {
      return this.enemy_data.team.filter(enemy => enemy && enemy.dex_number.toString() === dex_number.toString())[0]
    },
    pokemon_types(pokemon) {
      if (pokemon.battle_data) {
        return pokemon.battle_data.types;
      }
      return pokemon.types;
    }
  },
  computed: {
    multiplier() {
      let multiplier = 1;
      let stab_multiplier = this.stab ? 1.5 : 1;
      let offensive_boost = this.get_pokemon_boost(this.category === 'Especial' ? 'special_attack' : 'attack');
      let boost_multiplier = this.get_stat_offensive_multiplier(offensive_boost);
      if (this.category === 'Status') {
        return null;
      }
      if (!this.enemy_data) {
        return null;
      }
      let enemy = this.get_enemy_pokemon(this.enemy_data.selected_pokemon);
      if (!enemy) {
        return multiplier * stab_multiplier * boost_multiplier;
      }
      let enemy_types = this.pokemon_types(enemy);
      if (!enemy_types) {
        return multiplier * stab_multiplier * boost_multiplier;
      }

      let doubles = appearances(this.movement.coverage_data.double_damage_to, enemy_types)
      let halves = appearances(this.movement.coverage_data.half_damage_to, enemy_types)
      let zeroes = appearances(this.movement.coverage_data.no_damage_to, enemy_types)

      if (zeroes > 0) {
        multiplier = 0;
      } else {
        if (doubles > 0) {
          multiplier = doubles * 2;
        }
        if (halves > 0) {
          multiplier /= halves * 2;
        }
      }

      return multiplier * stab_multiplier * boost_multiplier;
    },
    type_image_path() {
      return `./assets/types/${this.movement.type}.png`;
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
    stab() {
      if (this.category === 'Status') {
        return false;
      }
      try {
        let this_type = this.movement.type.toLowerCase();
        let pokemon_types = this.pokemon.types.map((item) => item.name.toLowerCase());
        return !!pokemon_types.includes(this_type);
      } catch (e) {
        return false;
      }
    },
    accuracy_multiplier() {
      let accuracy = this.get_pokemon_boost('accuracy');
      return this.get_stat_strategical_multiplier(accuracy);
    },
  }
}
</script>

<style scoped>

</style>