<!--suppress JSVoidFunctionReturnValueUsed -->
<template>
  <v-tooltip location="top">
    <template v-slot:activator="{ props }">
      <v-alert v-bind="props" class="containerMovPokeBattle pa-1" :class="stab ? 'golden' : ''" rounded="pill" elevation="1">
        <v-row align="center" no-gutters class="mt-1 mb-1">
          <!-- Tipo -->
          <v-col cols="auto">
            <v-img :src="type_image_path" width="32" height="32" class="ml-2"/>
          </v-col>

          <!-- Nombre del movimiento -->
          <v-col class="text-start font-weight-bold">
            {{ movement.move_name }}
          </v-col>

          <v-col cols="auto">
            <v-img :src="getCategoryIcon(category)" width="32" height="32" :title="category" class="ml-2 mr-4" />
          </v-col>
          <v-col cols="auto" v-if="category !== 'Status' && enemy_data">
            <div :style="{
              backgroundColor:
                multiplier > 1 ? '#4CAF50' : multiplier < 1 ? '#F44336' : '#00AAD0',
              color: 'white',
              fontSize: '12px',
              borderRadius: '999px',
              padding: '4px 8px',
              fontWeight: 'bold',
            }">
              x{{ multiplier }}
            </div>
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
          <v-badge v-if="movement.power !== -1" color="error" :content="`Power: ${movement.power}`" inline></v-badge>
          <v-badge v-if="movement.power === -1" color="error" content="Power: -" inline></v-badge>
          <v-badge v-if="movement.accuracy !== -1" color="info"
            :content="`Precisión: ${movement.accuracy * accuracy_multiplier}%`" inline></v-badge>
          <v-badge v-if="movement.accuracy === -1" color="info" content="Precisión: -" inline></v-badge>
        </v-col>
      </v-row>
    </v-container>
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
      if (!dex_number || !this.enemy_data?.team) return null;
      return this.enemy_data.team.find(
        enemy => enemy && enemy.dex_number?.toString() === dex_number.toString()
      );
    },
    categoryColor() {
      switch (this.category.toLowerCase()) {
        case 'fisico':
          return '#E53935';
        case 'especial':
          return '#1E88E5';
        case 'status':
          return '#757575';
        default:
          return '#607D8B';
      }
    },
    getCategoryIcon(category) {
      const lower = category.toLowerCase();
      if (lower === 'fisico') return './imgs/physical_move.png';
      if (lower === 'especial') return './imgs/special_move.png';
      if (lower === 'status') return './imgs/status_move.png';
      return null;
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
      if (this.category === 'Status') {
        return null;
      }

      let enemy = this.get_enemy_pokemon(this.enemy_data.selected_pokemon);
      if (!enemy) {
        return 1;
      }

      let enemy_types = this.pokemon_types(enemy)
      if (!enemy_types) {
        return 1;
      }
      const static_moves = [
        "tinieblas",
        "furia dragón",
        "bomba sónica",
        "sísmico"
      ]

      let multiplier = 1;

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

      if (multiplier > 0 && static_moves.includes(this.movement.move_name.toLowerCase())) {
        return null;
      }

      return multiplier;
    },
    type_image_path() {
      return `./assets/types/Types/${this.movement.type}.png`;
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
.golden {
  background: #daa52050;
}
</style>