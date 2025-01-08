<template>
  <div class="card border-primary shadow" style="width: 19rem;margin-top:10px">
    <div class="card-header bg-primary text-white" v-if="team === 'enemy'">
      Pokemon enemigo
    </div>
    <div class="card-header bg-success text-white" v-if="team === 'you'">
      Pokemon atacando
    </div>
    <div class="row" style="padding:5px">
      <div class="col" style="padding-right: 0;">
        <img :src="pokemon ? pokemon.sprite_url : missingno" class="card-img-top" width="130" alt="">
        <div class="float-right" v-if="pokemon">
          <img :src="`./assets/types/${type_name(type.name)}.png`" v-for="(type, i) in pokemon.types" :key="i">
        </div>
      </div>
      <div class="col border-left">
        <div class="alert text-center" :class="team === 'enemy' ? 'alert-info' : 'alert-success'" style="padding:0px">
          {{ pokemon ? pokemon.mote : '???'}}
        </div>
        <p class="text-center font-weight-bold">{{ pokemon ? pokemon.species : '???'}}</p>
        <p class="text-center">Nivel {{ pokemon ? pokemon.level : '???'}}</p>
        <p class="text-center">{{ pokemon ? pokemon.types.map((v) => v.name).join("/") : '???'}}</p>
      </div>
    </div>
  </div>
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