<template>
  <main>
    <div class="card mb-4 shadow-lg border border-secondary" v-if="movement">
      <div class="row h-75">
        <span class="center">{{ movement.move_name }}</span>
      </div>
      <div class="row h-25 justify-content-end">
        <img class="col-2" height="20px" width="20px" :src="type" :alt="movement.type">
        <img class="col-2" height="20px" width="20px" :src="category" :alt="movement.category">
        <span class="col-1 badge bg-danger" v-if="multiplier">{{ multiplier }}</span>
        <span class="col-3 badge bg-info" v-if="stab">{{ stab }}</span>
      </div>
    </div>
  </main>
</template>

<script>
import {state} from '@/store.js';
import {toRaw} from "vue";

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
      return `./assets/categories/${this.movement.category}.png`;
    },
    multiplier() {
      if (!this.enemyPokemon) {
        return ''
      }
      return 'x2';
    },
    stab() {
      if (!this.pokemon || !this.pokemon.types) return '';
      if (this.pokemon.types.includes(this.movement.type)) {
        return 'STAB';
      }
      return '';
    }
  }
}
</script>

<style scoped>

</style>