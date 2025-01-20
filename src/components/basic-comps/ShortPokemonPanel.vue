<template>
  <v-card type="primary" class="mt-2" border>
    <template v-slot:title>
      <v-alert color="primary" class="p-0">
        Pokemon enemigo
      </v-alert>
    </template>
    <template v-slot:text>
      <v-row class="mt-0">
        <v-col cols="6">
          <v-row>
            <v-spacer/>
            <v-col class="w-100">
              <v-img :src="pokemon ? pokemon.sprite_url : missingno" width="96"/>
            </v-col>
          </v-row>
          <v-row class="w-100" justify="end" v-if="pokemon">
            <v-img v-for="(type, i) in pokemon_types" :key="i"
                   :src="`./assets/types/${type_name(type.name)}.png`"
                   width="32" max-width="32"/>
          </v-row>
        </v-col>
        <v-col cols="6">
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
      </v-row>
    </template>
  </v-card>
</template>


<script>

export default {
  name: "PokemonCard",
  emits: [],
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