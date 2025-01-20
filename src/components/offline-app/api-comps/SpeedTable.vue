<template>
  <v-data-table
      height="55vh"
      density="comfortable"
      hide-default-footer
      items-per-page="20"
      :items="speed_ordered_pokemon"
      :headers="headers">
    <template #item="{item}">
      <tr :class="itemRowBackground(item)">
        <td class="pa-0">
          <v-img :src="item.sprite_url" height="48"/>
        </td>
        <td>{{ item.mote }}</td>
        <td>{{ item.speed }}</td>
      </tr>
    </template>
  </v-data-table>
</template>

<script>
export default {
  name: "SpeedTable",
  props: {
    combat_info: {
      type: Object,
      required: false
    }
  },
  data() {
    return {
      headers: [
        {title: '', value: 'sprite_url'},
        {title: 'Nombre', value: 'mote'},
        {title: 'Velocidad', value: 'speed'},
      ]
    }
  },
  computed: {
    speed_ordered_pokemon() {
      let your_pokemons = this.combat_info.your_trainer.current_team.team.map((pokemon) => {
        return {
          sprite_url: pokemon.sprite_url,
          name: pokemon.pokemon.name,
          mote: pokemon.mote,
          team: 'you',
          speed: pokemon.speed,
          color: 'success'
        }
      });
      let enemy_pokemons = this.combat_info.enemy_trainer.current_team.team.map((pokemon) => {
        return {
          sprite_url: pokemon.sprite_url,
          name: pokemon.pokemon.name,
          mote: pokemon.mote,
          team: 'enemy',
          speed: pokemon.speed,
          color: 'teal'
        }
      });

      let pokemons = your_pokemons.concat(enemy_pokemons).sort((prev_pokemon, pokemon) => {
        if (pokemon.speed < prev_pokemon.speed) {
          return -1;
        } else if (pokemon.speed > prev_pokemon.speed) {
          return 1;
        }
        return 0
      })

      return pokemons
    }
  },
  methods: {
    itemRowBackground(item) {
      return item.team === 'you' ? 'success' : 'primary'
    }
  }
}
</script>

<style scoped>
.success {
  background-color: rgb(76, 175, 80);
  color: white;
}

.primary {
  background-color: rgb(24, 103, 192);
  color: white;
}

</style>
