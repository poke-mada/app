<template>
  <v-card type="primary" class="mt-2" border width="auto">
    <v-alert :type="team === 'enemy' ? 'primary' : 'success'" class="p-0">
      <span v-if="team === 'enemy'">
        PokemonTeamData enemigo
      </span>
      <span v-if="team === 'you'">
        PokemonTeamData atacando
      </span>
    </v-alert>
    <v-row class="mt-1" width="auto">
      <v-col cols="2">
        <v-row>
          <v-col>
            <img :src="pokemon ? pokemon.sprite_url : missingno" @click="dialog = true" class="card-img-top" width="130" alt="">
          </v-col>
        </v-row>
        <v-row justify="end">
          <v-col></v-col>
          <v-col sm>
            <div v-if="pokemon">
              <v-img :src="`./assets/types/${type_name(type.name)}.png`" v-for="(type, i) in pokemon_types" :key="i"
                     width="32" inline></v-img>
            </div>
          </v-col>
        </v-row>
      </v-col>
      <v-col cols="2">
        <v-alert :type="team === 'enemy' ? 'info' : 'success'" variant="tonal" class="pb-0 pt-0 mt-1">
          <template v-slot:prepend>
          </template>
          <template v-slot:text>
            {{ pokemon ? pokemon.mote : '???' }}
          </template>
        </v-alert>
        <p class="text-center font-weight-bold">{{ pokemon ? pokemon.species : '???' }}</p>
        <p class="text-center">{{ pokemon ? pokemon_types.map((v) => v.name).join("/") : '???' }}</p>
      </v-col>
      <v-col cols="8" v-if="team === 'you'">
        <v-row v-if="pokemon">
          <v-col cols="6" v-for="(move, index) in pokemon.moves" :key="index">
            <MovementCard :pokemon="pokemon" :enemy_data="enemy_data" :movement="move" v-if="move"/>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-card>
</template>


<script>
import MovementCard from "@/components/basic-comps/MovementCard";

export default {
  name: "PokemonCard",
  emits:[],
  components: {
    MovementCard
  },
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
  methods: {
    type_name(val) {
      return String(val).charAt(0).toUpperCase() + String(val).slice(1);
    }
  },
  computed: {
    pokemon() {
      console.log(this.pk_slot)
      return this.team_data.team[this.pk_slot];
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

</style>