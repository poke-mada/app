<!--suppress JSVoidFunctionReturnValueUsed -->
<template>
  <v-card border>
    <template v-slot:title>
      <v-alert :color="team === 'enemy' ? 'error' : team === 'ally' ? 'info' : 'success'" class="p-0">
            <span v-if="team === 'enemy'">
              Pokemon enemigo
            </span>
        <span v-if="team === 'you'">
              Pokemon atacando
            </span>
        <span v-if="team === 'ally'">
              Pokemon aliado atacando
            </span>
      </v-alert>
    </template>
    <template v-slot:text>
      <v-row class="mt-0">
        <v-col cols="2">
          <v-row>
            <v-col cols="6">
              <v-img :src="pokemon ? pokemon.sprite_url : missingno" width="128"/>
            </v-col>
            <v-col cols="6">
              <v-row v-if="team === 'you'">
                <v-col cols="12" class="pa-0 ma-0">
                  <v-badge bordered
                           :color="get_pokemon_boost('defense') < 0? 'error' : get_pokemon_boost('defense') > 0 ? 'success' : 'info'"
                           :content="`Defensa: ${get_pokemon_boost('defense')}`"/>
                </v-col>
                <v-col cols="12" class="pa-0 ma-0">
                  <v-badge bordered
                           :color="get_pokemon_boost('special_defense') < 0? 'error' : get_pokemon_boost('special_defense') > 0 ? 'success' : 'info'"
                           :content="`Defensa Especial: ${get_pokemon_boost('special_defense')}`"/>
                </v-col>
                <v-col cols="12" class="pa-0 ma-0">
                  <v-badge bordered
                           :color="get_pokemon_boost('speed') < 0? 'error' : get_pokemon_boost('speed') > 0 ? 'success' : 'info'"
                           :content="`Velocidad: ${get_pokemon_boost('speed')}`"/>
                </v-col>
                <v-col cols="12" class="pa-0 ma-0">
                  <v-badge bordered
                           :color="get_pokemon_boost('evasion') < 0? 'error' : get_pokemon_boost('evasion') > 0 ? 'success' : 'info'"
                           :content="`Evasión: ${get_pokemon_boost('evasion')}`"/>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <div v-if="pokemon">
                <v-img v-for="(type, i) in pokemon_types" :key="i"
                       :src="`./assets/types/${type_name(type.name)}.png`"
                       width="32" inline/>
              </div>
            </v-col>
          </v-row>
        </v-col>
        <v-col cols="2">
          <v-row>
            <v-spacer/>
            <v-col class="text-center">
              <span class="justify-center mote" :class="team === 'enemy' ? 'info' : 'success'">
                {{ pokemon ? pokemon.mote : '???' }}
              </span>
            </v-col>
            <v-spacer/>
          </v-row>
          <p class="text-center font-weight-bold">{{ pokemon ? pokemon.species : '???' }}</p>
          <p class="text-center">{{ pokemon ? pokemon_types.map((v) => v.name).join("/") : '???' }}</p>
        </v-col>
        <v-col cols="8">
          <v-row v-if="pokemon && team === 'you'">
            <v-col cols="6" v-for="(move, index) in pokemon.moves" :key="index">
              <MovementCard :pokemon="pokemon" :enemy_data="enemy_data" :movement="move" v-if="move"/>
            </v-col>
          </v-row>
          <v-row class="pa-0 ma-0" v-if="team !== 'you'">
            <v-col cols="12" class="pa-0 ma-0">
              <v-badge bordered
                       :color="get_pokemon_boost('attack') < 0? 'error' : get_pokemon_boost('attack') > 0 ? 'success' : 'info'"
                       :content="`Ataque: ${get_pokemon_boost('attack')}`"/>
            </v-col>
            <v-col cols="12" class="pa-0 ma-0">
              <v-badge bordered
                       :color="get_pokemon_boost('defense') < 0? 'error' : get_pokemon_boost('defense') > 0 ? 'success' : 'info'"
                       :content="`Defensa: ${get_pokemon_boost('defense')}`"/>
            </v-col>
            <v-col cols="12" class="pa-0 ma-0" v-if="team !== 'you'">
              <v-badge bordered
                       :color="get_pokemon_boost('special_attack') < 0? 'error' : get_pokemon_boost('special_attack') > 0 ? 'success' : 'info'"
                       :content="`Ataque Especial: ${get_pokemon_boost('special_attack')}`"/>
            </v-col>
            <v-col cols="12" class="pa-0 ma-0">
              <v-badge bordered
                       :color="get_pokemon_boost('special_defense') < 0? 'error' : get_pokemon_boost('special_defense') > 0 ? 'success' : 'info'"
                       :content="`Defensa Especial: ${get_pokemon_boost('special_defense')}`"/>
            </v-col>
            <v-col cols="12" class="pa-0 ma-0">
              <v-badge bordered
                       :color="get_pokemon_boost('speed') < 0? 'error' : get_pokemon_boost('speed') > 0 ? 'success' : 'info'"
                       :content="`Velocidad: ${get_pokemon_boost('speed')}`"/>
            </v-col>
            <v-col cols="12" class="pa-0 ma-0">
              <v-badge bordered
                       :color="get_pokemon_boost('evasion') < 0? 'error' : get_pokemon_boost('evasion') > 0 ? 'success' : 'info'"
                       :content="`Evasión: ${get_pokemon_boost('evasion')}`"/>
            </v-col>
            <v-col cols="12" class="pa-0 ma-0">
              <v-badge bordered
                       :color="get_pokemon_boost('accuracy') < 0? 'error' : get_pokemon_boost('accuracy') > 0 ? 'success' : 'info'"
                       :content="`Precisión: ${get_pokemon_boost('accuracy')}`"/>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </template>
  </v-card>
</template>


<script>
import MovementCard from "@/components/basic-comps/MovementCard";

export default {
  name: "DualPokemonPanel",
  emits: [],
  components: {
    MovementCard
  },
  props: {
    team: {
      type: String,
      required: true
    },
    pk_dex: {
      type: Number,
      required: false
    },
    team_data: {
      type: Object,
      required: true
    },
    ally_data: {
      type: Object,
      required: false
    },
    enemy_data: {
      type: Object,
      required: true
    }
  },
  methods: {
    get_imposter_pokemon(dex_number) {
      if (dex_number) {
        return this.enemy_data.team.filter(pokemon => pokemon && pokemon.dex_number.toString() === dex_number.toString())[0]
      }
      return null
    },
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
    get_imposter_pokemon_data(dex_number) {
      if (!dex_number) {
        return null;
      }
      return this.enemy_data.team_data.filter(pokemon => pokemon && pokemon.dex_number.toString() === dex_number.toString())[0]
    },
    get_pokemon(dex_number) {
      if (this.team === 'ally') {
        return this.get_ally_pokemon(dex_number);
      }
      return this.team_data.team.filter(pokemon => pokemon && pokemon.dex_number.toString() === dex_number.toString())[0]
    },
    type_name(val) {
      return String(val).charAt(0).toUpperCase() + String(val).slice(1);
    },
    get_ally_pokemon(dex_number) {
      console.log(dex_number, this.ally_data.team)
      return this.ally_data.team.filter(ally => ally && ally.dex_number === dex_number)[0]
    }
  },
  computed: {
    pokemon() {
      if (!this.pk_dex) {
        return null;
      }

      if (this.team === 'ally') {
        return this.get_ally_pokemon(this.pk_dex);
      }

      if (!this.team_data.team.map(pokemon => pokemon && pokemon.dex_number).includes(this.pk_dex)) {
        // noinspection UnnecessaryLocalVariableJS
        const imposter = this.get_imposter_pokemon(this.pk_dex); // TODO: esto tambien cambiaria los stat boosts, ashuda

        if (this.team === 'you') {
          let data = this.get_imposter_pokemon_data(this.pk_dex);
          if (data && imposter) {
            imposter.moves = data.moves;
          }
        }

        return imposter;
      }
      return this.get_pokemon(this.pk_dex);
    },
    pokemon_types() {
      if (this.pokemon.battle_data) {
        return this.pokemon.battle_data.types;
      }
      return this.pokemon.types;
    }
  },
  data() {
    return {
      dialog: false,
      missingno: 'https://static.wikia.nocookie.net/bec6f033-936d-48c5-9c1e-7fb7207e28af'
    }
  }
}
</script>

<style scoped>
.mote {
  border-radius: 10px;
  padding: .2rem 1rem;
}

.success {
  background-color: rgba(76, 175, 80, 0.8);
  color: white;
}

.info {
  background-color: rgba(33, 150, 243, 0.8);
  color: white;
}
</style>