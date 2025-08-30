<!-- CUADRO PEQUEÑO DEL POKEMON DE LA HORDA -->
<template>
  <v-container  @click="$emit('showDetails', pokemon)" style="cursor: pointer;">
    <v-row class="mt-0 cardPokemon2">
      <v-col cols="4" class="minHeight">
        <div class="cardImgPokeBattle">
          <v-img :src="pokemon ? pokemon.sprite_url : missingno" />
        </div>
      </v-col>
      <v-col cols="8">
        <p class="pokemon-number">
          #{{ pokemon ? String(pokemon.dex_number).padStart(4, '0') : '????' }}
        </p>
        <p class="pokemon-name">{{ pokemon ? pokemon.species : '???' }}</p>
        <p class="pokemon-level">Nv. {{ pokemon.level }}</p>

        <div class="pokemon-type" v-if="pokemon_types && pokemon_types.length">
          <div v-for="(type, i) in pokemon_types" :key="i" class="d-inline">
            <v-tooltip location="top">
              <template v-slot:activator="{props}">
                <v-img :src="`./assets/types/Types/${type_name(type.name)}.png`" width="50" inline v-bind="props" />
              </template>
              {{type_name_loc(type.name)}}
            </v-tooltip>
          </div>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>


<script>

import {TRANSLATIONS} from "@/data/type_data";

export default {
  name: "ShortPokemonPanel",
  emits: ['showDetails'],
  components: {},
  props: {
    team: {
      type: String,
      required: true
    },
    pk_slot: {
      type: String,
      required: true
    },
    team_data: {
      type: Object,
      required: true
    },
    enemy_data: {
      type: Object,
      required: true
    }
  },
  // mounted() {
  //   console.log('🔍 Pokémon al montar:', this.pokemon);
  //   console.log('🔍 Tipos del Pokémon:', this.pokemon_types.map((v) => v.name));
  // },
  methods: {
    get_imposter_pokemon(dex_number) {
      if (!dex_number) {
        return null;
      }
      return this.enemy_data.team.filter(pokemon => pokemon && pokemon.dex_number.toString() === dex_number.toString())[0]
    },
    get_imposter_pokemon_data(dex_number) {
      return this.enemy_data.team_data.filter(pokemon => pokemon && pokemon.dex_number.toString() === dex_number.toString())[0]
    },
    get_pokemon(dex_number) {
      return this.team_data.team.filter(pokemon => pokemon && pokemon.dex_number.toString() === dex_number.toString())[0]
    },
    type_name(val) {
      return String(val).charAt(0).toUpperCase() + String(val).slice(1);
    },
    type_name_loc(val) {
      return TRANSLATIONS[val];
    }
  },
  computed: {
    pokemon() {
      if (!this.team_data.team.map(pokemon => pokemon.dex_number).includes(this.pk_slot)) {
        // noinspection UnnecessaryLocalVariableJS
        const imposter = this.get_imposter_pokemon(this.pk_slot); // TODO: esto tambien cambiaria los stat boosts, ashuda
        return imposter;
      }
      return this.get_pokemon(this.pk_slot);
    },
    pokemon_types() {
      if (this.pokemon.battle_data) {
        return this.pokemon.battle_data.types.filter((item) => !!item.name);
      }
      return this.pokemon.types.filter((item) => !!item);
    }
  },
  data() {
    return {
      dialog: false,
      missingno: 'https://res.cloudinary.com/dtattuxue/image/upload/v1753918578/Pokeball_qi5tk3.svg'
    }
  }
}
</script>

<style scoped>
.cardPokemon2 {
  position: relative;
  border-radius: 40px;
  background-color: white;
  padding: 1rem 0;
  z-index: 1;
  overflow: hidden;
  text-align: center;
  margin-bottom: 10px;
  cursor: pointer;
}

.cardPokemon2::before {
  content: "";
  position: absolute;
  inset: 0;
  padding: 1px;
  /* grosor del borde */
  border-radius: inherit;
  background: linear-gradient(180deg, var(--pink) 0%, var(--blue) 100%);
  -webkit-mask:
    linear-gradient(#fff 0 0) content-box,
    linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  z-index: -1;
  pointer-events: none;
}

.cardPokemon2 .cardImgPokeBattle2 {
  width: 170%;
  z-index: 100;
  position: relative;
}

.minHeight {
  max-height: 130px;
}
.cursor-pointer img {
  cursor: pointer !important;
}
</style>