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
            <v-col>
              <v-badge bordered :content="category" color="secondary" inline></v-badge>
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
          <v-badge v-if="movement.power !== -1" color="danger" :content="`Power: ${movement.power}`" inline></v-badge>
          <v-badge v-if="movement.power === -1" color="danger" content="Power: -" inline></v-badge>
          <v-badge v-if="movement.accuracy !== -1" color="info" :content="`Accuracy: ${movement.accuracy}%`" inline></v-badge>
          <v-badge v-if="movement.accuracy === -1" color="info" content="Accuracy: -" inline></v-badge>
          <v-badge v-if="stab" color="success" content="STAB" bordered inline></v-badge>
        </v-col>
      </v-row>
      <v-row>
        <v-col v-for="(enemy_slot, index) in this.enemy_data.selected_pokemon" :key="index" class="pr-0">
          <div v-if="this.multiplier(enemy_data.team[enemy_slot]) !== 1">
            <v-img :src="enemy_data.team[enemy_slot].sprite_url" width="64" aspect-ratio="1/1"></v-img>
            <v-badge
                bordered
                :content="`x${this.multiplier(enemy_data.team[enemy_slot])}`"
                :color="this.multiplier(enemy_data.team[enemy_slot]) > 1 ? 'success' : 'danger'"
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
  return enemyTypes.filter(item => coverageTypes.includes(item.name)).length;
}

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
    enemy_data: {
      type: Object,
      required: false
    },
  },
  methods: {
    multiplier(enemy) {
      if (!enemy) {
        return 1;
      }


      if (this.category === 'Status') {
        return 1;
      }

      let doubles = appearances(this.movement.coverage.double_damage_to, enemy.types)
      let halves = appearances(this.movement.coverage.half_damage_to, enemy.types)
      let zeroes = appearances(this.movement.coverage.no_damage_to, enemy.types)

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
  },
  computed: {
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
    }
  }
}
</script>

<style scoped>

</style>