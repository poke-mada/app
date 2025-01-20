<template>
  <v-card type="primary" class="mt-2" border>
    <v-alert :color="team === 'enemy' ? 'primary' : 'success'" class="p-0">
      <span v-if="team === 'enemy'">
        Pokemon enemigo
      </span>
      <span v-if="team === 'you'">
        Pokemon atacando
      </span>
    </v-alert>
    <v-row class="mt-1">
      <v-col cols="2">
        <v-row>
          <v-spacer/>
          <v-col>
            <v-img :src="pokemon ? pokemon.sprite_url : missingno" class="card-img-top" width="130"/>
          </v-col>
        </v-row>
        <v-row>
          <v-col sm>
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
      <v-col cols="8" v-if="team === 'you'">
        <v-row v-if="pokemon">
          <v-col cols="6" v-for="(move, index) in pokemon.moves" :key="index">
            <SingleMovementCard :pokemon="pokemon" :enemy_data="enemy_data" :movement="move" v-if="move"/>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-card>
</template>


<script>
import SingleMovementCard from "@/components/basic-comps/SingleMovementCard";

export default {
  name: "PokemonCard",
  emits: [],
  components: {
    SingleMovementCard
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
      return this.team_data.team[this.pk_slot];
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