<template>
  <div class="alert alert-success" role="alert">
    <img :src="type_image_path" v-if="movement" alt="">
    {{ movement.move_name }}
    <div class="badge bg-secondary float-right">{{category}}</div>
    <div class="badge bg-success float-right" v-if="stab">STAB</div>
    <div class="badge float-right" :class="multiplier > 1 ? 'bg-success' : 'bg-danger'" v-if="multiplier !== 1">x{{multiplier}}</div>
  </div>
</template>

<script>

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
    pokemon: {
      type: Object,
      required: false
    },
    enemy: {
      type: Object,
      required: false
    },
  },
  computed: {
    type_image_path() {
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
      if (!this.enemy) {
        return 1;
      }


      if (this.category === 'Status') {
        return 1;
      }

      let doubles = appearances(this.movement.coverage.double_damage_to, this.enemy.types)
      let halves = appearances(this.movement.coverage.half_damage_to, this.enemy.types)
      let zeroes = appearances(this.movement.coverage.no_damage_to, this.enemy.types)

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

      return multiplier;
    },
    stab() {
      if (this.category === 'Status') {
        return false;
      }
      try {
        let this_type = this.movement.type.toLowerCase();
        let pokemon_types = this.pokemon.types.map((item) => item.name.toLowerCase());
        return !!pokemon_types.includes(this_type);
      } catch (e) {
        return false;
      }
    }
  }
}
</script>

<style scoped>

</style>