<template>
  <v-tooltip location="top" v-model="display_tooltip">
    <template v-slot:activator="{ props }">
      <v-alert v-bind="props" class="mb-2 w-100 pl-1" :icon="type_image_path" @click="display_tooltip = !display_tooltip">
        <template v-slot:prepend>
          <v-img :src="type_image_path" v-if="movement" width="32" inline></v-img>
        </template>
        <template v-slot:text>
          <v-row>
            <v-col cols="12">
              <span class="text-caption">
                {{ movement.name }}
              </span>
            </v-col>
          </v-row>
        </template>
        <template v-slot:append>
          <v-row>
            <v-col>
              <v-badge class="text-caption" bordered :content="category" color="secondary" inline></v-badge>
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
          <v-badge class="text-caption" v-if="movement.power !== -1" color="danger"
                   :content="`Power: ${movement.power}`" inline></v-badge>
          <v-badge class="text-caption" v-if="movement.power === -1" color="danger" content="Power: -" inline></v-badge>
          <v-badge class="text-caption" v-if="movement.accuracy !== -1" color="info"
                   :content="`Accuracy: ${movement.accuracy}%`"
                   inline></v-badge>
          <v-badge class="text-caption" v-if="movement.accuracy === -1" color="info" content="Accuracy: -"
                   inline></v-badge>
          <v-badge class="text-caption" v-if="stab" color="success" content="STAB" bordered inline></v-badge>
        </v-col>
      </v-row>
      <v-row v-if="enemy_data">
        <v-col cols="2" v-for="(enemy_slot, index) in enemies" :key="index">
          <div v-if="category !== 'Status' && enemy_data.team[enemy_slot]">
            <v-img :src="enemy_data.team[enemy_slot].sprite_url" width="64" aspect-ratio="1/1"/>
            <v-badge
                bordered
                v-if="multiplier(enemy_data.team[enemy_slot]) !== null"
                :content="`x${multiplier(enemy_data.team[enemy_slot])}`"
                :color="multiplier(enemy_data.team[enemy_slot]) > 1 ? 'success' : multiplier(enemy_data.team[enemy_slot]) < 1 ? 'error' : 'info'"
                inline
            ></v-badge>
          </div>
        </v-col>
      </v-row>
    </span>
  </v-tooltip>
</template>

<script>

function appearances(coverageTypes, enemyTypes) {
  let lowered_enemy_types = enemyTypes.map((item) => item.name.toLowerCase());
  let filtered = lowered_enemy_types.filter(item => coverageTypes.includes(item));
  return filtered.length;
}

export default {
  name: "MovementCard",
  components: [],
  props: {
    pokemon: {
      type: Object,
      required: true
    },
    is_selected: {
      type: Boolean,
      required: false
    },
    movement: {
      type: Object,
      required: true
    },
    enemy_data: {
      type: Object,
      required: false
    },
    forced_type: {
      type: String,
      required: false
    },
  },
  methods: {
    multiplier(enemy) {
      if (!enemy) {
        return null;
      }
      let enemy_types = this.pokemon_types(enemy);
      if (!enemy_types) {
        return null;
      }

      if (this.category === 'Status') {
        return null;
      }

      let doubles = appearances(this.movement.double_damage_to, enemy_types)
      let halves = appearances(this.movement.half_damage_to, enemy_types)
      let zeroes = appearances(this.movement.no_damage_to, enemy_types)

      let multiplier = 1;
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

      return multiplier;
    },
    pokemon_types(pokemon) {
      if (pokemon.battle_data) {
        return pokemon.battle_data.types;
      }
      return pokemon.types;
    }
  },
  computed: {
    enemies() {
      if (this.is_selected) {
        return this.enemy_data.selected_pokemon
      }
      return [0, 1, 2, 3, 4, 5]
    },
    move_type() {
      if (this.forced_type) {
        return this.forced_type
      }
      return this.movement.move_type
    },
    type_image_path() {
      return `./assets/types/${this.move_type}.png`;
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
        let this_type = this.movement.move_type.toLowerCase();
        let pokemon_types = this.pokemon_types(this.pokemon).map((item) => item.name.toLowerCase());
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

</style>
