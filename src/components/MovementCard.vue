<template>
  <div class="alert alert-success" role="alert">
    <img :src="type" alt="">
    {{ movement.move_name }}
    <div class="badge bg-success float-right" v-if="stab">STAB</div>
    <div class="badge float-right" :class="multiplier > 1 ? 'bg-success' : 'bg-danger'" v-if="multiplier">x{{multiplier}}</div>
    <div class="badge bg-secondary float-right">{{category}}</div>
  </div>
</template>

<script>
import {state} from '@/store.js';
import {toRaw} from "vue";

function appearances(coverageTypes, enemyTypes) {
  return enemyTypes.filter(item => coverageTypes.includes(item.name)).length;
}

export default {
  name: "MovementCard",
  props: {
    movement: {
      type: Object,
      required: true
    },
  },
  computed: {
    pokemon() {
      return toRaw(state.selectedPokemon);
    },
    enemyPokemon() {
      return toRaw(state.selectedEnemyPokemon);
    },
    type() {
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
    multiplier() {
      if (!this.enemyPokemon) {
        return ''
      }

      let doubles = appearances(this.movement.coverage.double_damage_to, this.enemyPokemon.types)
      let halves = appearances(this.movement.coverage.half_damage_to, this.enemyPokemon.types)
      let zeroes = appearances(this.movement.coverage.no_damage_to, this.enemyPokemon.types)
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
      if (multiplier === 1) {
        return '';
      }
      return multiplier;
    },
    stab() {
      if (!this.pokemon || !this.pokemon.types) return '';
      try {
        let this_type = toRaw(this.movement.type).toLowerCase();
        if (this.pokemon.types.map((item) => item.name).includes(this_type)) {
          return './assets/stab.png';
        }
        return '';
      } catch (e) {
        return '';
      }
    }
  }
}
</script>

<style scoped>

</style>