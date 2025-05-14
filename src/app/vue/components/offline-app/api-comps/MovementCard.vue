<template>
  <v-tooltip location="top" v-model="display_tooltip">
    <template v-slot:activator="{ props }">
      <v-alert v-bind="props" class="mb-1 w-100 pl-2 pt-1 pb-1" :icon="type_image_path" color="#CACACA"
               @click="display_tooltip = !display_tooltip">
        <template v-slot:prepend>
          <img :src="type_image_path" v-if="movement" class="move-type" alt=""/>
        </template>
        <template v-slot:text>
          <v-row>
            <v-col cols="12">
              <span class="move-name">
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
        <v-col cols="12" v-html="movement.flavor_text.replace('\r\n', '<br/>')">
        </v-col>
        <v-col cols="12">
          <v-badge class="text-caption" v-if="movement.power !== -1" color="danger"
                   :content="`Power: ${movement.power}`" inline/>
          <v-badge class="text-caption" v-if="movement.power === -1" color="danger" content="Power: -" inline/>
          <v-badge class="text-caption" v-if="movement.accuracy !== -1" color="info"
                   :content="`Accuracy: ${movement.accuracy}%`"
                   inline/>
          <v-badge class="text-caption" v-if="movement.accuracy === -1" color="info" content="Accuracy: -" inline/>
        </v-col>
      </v-row>
      <v-row v-if="enemy_data">
        <v-col cols="2" v-for="(enemy_slot, index) in enemies" :key="index">
          <div v-if="enemy_data.team[enemy_slot]">
            <v-img :src="enemy_data.team[enemy_slot].sprite_url" width="64" aspect-ratio="1/1"/>
            <v-badge
              bordered
              class="v-badge"
              v-if="multiplier(enemy_data.team[enemy_slot]) !== null"
              :content="`x${multiplier(enemy_data.team[enemy_slot])}`"
              :color="multiplier(enemy_data.team[enemy_slot]) > 1 ? 'success' : multiplier(enemy_data.team[enemy_slot]) < 1 ? 'error' : 'info'"
              inline
            />
          </div>
        </v-col>
      </v-row>
    </span>
  </v-tooltip>
</template>

<script>
import {
  appearances,
  get_item_multiplier,
  get_ability_multiplier,
  ignored_by_pokemon_ability as _ignored_by_pokemon_ability,
  get_team_multiplier, get_ability
} from "@/data/mon_functions";


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
      let type_multiplier = 1;
      let stab_multiplier = 1;
      let item_multiplier = 1;
      let ability_multiplier = 1;
      let team_multiplier = 1;
      if (!enemy) {
        return null;
      }
      if (enemy.impostered) {
        enemy = enemy.impostered;
      }

      let enemy_types = this.pokemon_types(enemy);
      if (!enemy_types) {
        return null;
      }
      team_multiplier = get_team_multiplier(this.enemy_data, enemy, enemy_types, this.move_type);
      ability_multiplier = get_ability_multiplier(this.pokemon, enemy, this.move_type, this.movement.index);

      if (this.category === 'Status') {
        if (ability_multiplier === 0) {
          return 0; // TODO: spores doesnt appear as x0 when grass type
        }
        const ignored_by_pokemon_ability = _ignored_by_pokemon_ability(this.pokemon, enemy, this.movement)
        if (ignored_by_pokemon_ability) {
          return 0;
        }

        return team_multiplier === 0 ? 0 : null;
      }

      if (this.stab) {
        stab_multiplier = 1.5;
      }

      let doubles = appearances(this.movement.double_damage_to, enemy_types)
      let halves = appearances(this.movement.half_damage_to, enemy_types)
      let zeroes = appearances(this.movement.no_damage_to, enemy_types)

      if (zeroes > 0) {
        if (enemy_types.map(typ=>typ.name.toLowerCase()).includes('flying') && this.movement.index === 614) {
          zeroes = appearances(this.movement.no_damage_to, enemy_types.filter(typ => typ && typ.name.toLowerCase() !== 'flying'));
          if (zeroes > 0) {
            return 0;
          }
        } else {
          return 0;
        }
      }

      if (doubles > 0) {
        type_multiplier = doubles * 2;
      }
      if (halves > 0) {
        type_multiplier /= halves * 2;
      }

      item_multiplier = get_item_multiplier(this.pokemon, type_multiplier, this.move_type, this.category_value);
      const total_multiplier = type_multiplier * stab_multiplier * item_multiplier * ability_multiplier * team_multiplier;

      return total_multiplier.toFixed(2).replace(/[.,]00$/, "");
    },
    pokemon_types(pokemon) {
      if (pokemon.protean_type) {
        return pokemon.protean_type
      }
      if (pokemon.impostered) {
        return pokemon.impostered.types
      }
      if (pokemon.got_types) {
        return pokemon.got_types
      }

      return pokemon.types;
    },
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
    category_value() {
      switch (this.movement.category) {
        case 'Non-Damaging':
          return 'status';
        case 'Physical':
          return 'physic';
        case 'Special':
          return 'special';
        default:
          return 'None';
      }
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
@media (max-width: 1600px) {
  .move-name {
    font-size: 14px !important;
  }

  .v-badge * {
    font-size: 6px !important;
  }

  .move-type {
    max-height: 16px !important;
    max-width: 16px !important;
  }
}

.move-type {
  display: inline;
  max-height: 32px;
  max-width: 32px;
}
</style>
