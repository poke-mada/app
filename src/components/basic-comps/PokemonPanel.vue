<template>
  <v-card type="primary" class="mt-2" border>
    <v-alert :type="team === 'enemy' ? 'primary' : 'success'" class="p-0">
      <v-card-title v-if="team === 'enemy'" >
        Pokemon enemigo
      </v-card-title>
      <v-card-title v-if="team === 'you'" >
        Pokemon atacando
      </v-card-title>
    </v-alert>
    <v-row>
      <v-col cols="6">
        <img :src="pokemon ? pokemon.sprite_url : missingno" class="card-img-top" width="130" alt="">
        <div class="float-right" v-if="pokemon">
          <v-img :src="`./assets/types/${type_name(type.name)}.png`" v-for="(type, i) in pokemon.types" :key="i" width="32" inline></v-img>
        </div>
      </v-col>
      <v-col cols="6">
        <v-alert :type="team === 'enemy' ? 'info' : 'success'" variant="tonal" class="pb-0 pt-0 mt-1">
          <template v-slot:prepend>
          </template>
          <template v-slot:text>
            {{ pokemon ? pokemon.mote : '???' }}
          </template>
        </v-alert>
        <p class="text-center font-weight-bold">{{ pokemon ? pokemon.species : '???'}}</p>
        <p class="text-center">Nivel {{ pokemon ? pokemon.level : '???'}}</p>
        <p class="text-center">{{ pokemon ? pokemon.types.map((v) => v.name).join("/") : '???'}}</p>
      </v-col>
    </v-row>
  </v-card>
</template>

<script>

export default {
  name: "PokemonCard",
  components: {},
  props: {
    pokemon: {
      type: Object,
      required: false
    },
    team: {
      type: String,
      required: true
    }
  },
  methods: {
    type_name(val) {
      return String(val).charAt(0).toUpperCase() + String(val).slice(1);
    }
  },
  data() {
    return {
      missingno: 'https://static.wikia.nocookie.net/bec6f033-936d-48c5-9c1e-7fb7207e28af'
    }
  }
}
</script>

<style scoped>

</style>