<!--suppress JSUnresolvedVariable -->
<template>
  <v-row>
    <v-spacer @click="close_display()"/>
    <v-col md="4" class="mt-5">
      <v-card max-height="75vh">
        <template v-slot:text>
          <v-alert type="primary" text="Ataques de tipo" class="pa-0 text-center">
            <template v-slot:prepend></template>
            <template v-slot:append></template>
            <template v-slot:close></template>
          </v-alert>
          <v-row justify="center" class="w-100 mt-1" align="center">
            <v-col v-for="(pokemon_type, index) in pokemon_types" cols="3" :key="index">
              <v-row>
                <v-spacer/>
                <v-col class="text-center">
                  <v-row>
                    <v-spacer/>
                    <v-col class="pa-0">
                      <v-img :src="`./assets/types/${pokemon_type}.png`" width="32" aspect-ratio="1/1"/>
                    </v-col>
                    <v-spacer/>
                  </v-row>
                  <v-row>
                    <v-spacer/>
                    <v-col class="pa-0">
                      <span>{{ pokemon_type }}</span>
                    </v-col>
                    <v-spacer/>
                  </v-row>
                  <v-row justify="center" class="w-100">
                    <v-col class="pa-2">
                      <v-badge
                        :color="get_multiplier(pokemon_type) < 1 ? 'success' : get_multiplier(pokemon_type) === 1 ? 'info' : 'error'"
                        :content="`x${get_multiplier(pokemon_type)}`" bordered inline/>
                    </v-col>
                  </v-row>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </template>
      </v-card>
    </v-col>
    <v-spacer @click="close_display()"/>
    <v-col md="4">
      <v-card max-height="75vh">
        <PokemonTeamList team="you"
                         @pokemon_selected="select_you_pokemon"
                         :force_plain="this.selected_slot_from === 'enemy'"
                         :data="this.combat_data.your_data"/>
      </v-card>
    </v-col>
    <v-spacer @click="close_display()"/>
  </v-row>
</template>

<script>
import {POKEMON_TYPES} from "@/data/type_data";
import PokemonTeamList from '@/components/basic-comps/PokemonTeamList';
import {get_coverage, appearances} from "@/data/mon_functions";

export default {
  name: "CoverageTableDisplay",
  emits: ['close_display'],
  components: {
    PokemonTeamList,
  },
  props: {
    combat_data: {
      type: Object,
      required: true
    }
  },
  methods: {
    close_display() {
      this.$emit('close_display')
    },
    get_multiplier(attack_type) {
      return this.calc_multiplier(this.pokemon_selected, attack_type);
    },
    select_you_pokemon(pokemon) {
      this.selected_slot_from = 'you';
      this.pokemon_selected = pokemon;
    },
    select_enemy_pokemon(pokemon) {
      this.selected_slot_from = 'enemy';
      this.pokemon_selected = pokemon;
    },
    _pokemon_types(pokemon) {
      if (pokemon.protean_type) {
        return pokemon.protean_type
      }
      if (pokemon.got_types) {
        return pokemon.got_types;
      }
      return pokemon.types;
    },
    calc_multiplier(enemy, attack_type) {
      if (!enemy) {
        return 1;
      }
      let type_multiplier = 1;
      let stab_multiplier = 1;

      let enemy_types = this._pokemon_types(enemy);
      if (!enemy_types) {
        return null;
      }

      const coverage_data = get_coverage(attack_type);
      let doubles = appearances(coverage_data.double_damage_to, enemy_types)
      let halves = appearances(coverage_data.half_damage_to, enemy_types)
      let zeroes = appearances(coverage_data.no_damage_to, enemy_types)

      if (zeroes > 0) {
        type_multiplier = 0;
      } else {
        if (doubles > 0) {
          type_multiplier = doubles * 2;
        }
        if (halves > 0) {
          type_multiplier /= halves * 2;
        }
      }

      return type_multiplier * stab_multiplier;
    },
  },
  data() {
    return {
      selected_slot_from: null,
      pokemon_selected: null,
      pokemon_types: POKEMON_TYPES,
    }
  },
}
</script>

<style scoped>

</style>
