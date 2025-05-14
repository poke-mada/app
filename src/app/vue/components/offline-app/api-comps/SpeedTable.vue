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

<!--suppress UnnecessaryLocalVariableJS, JSUnresolvedVariable, SpellCheckingInspection -->
<script>
import {get_stat, get_sprite, get_form} from '@/data/mon_functions'

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
          held_item_name: pokemon.held_item_name,
          nature: pokemon.nature,
          level: pokemon.level,
          item: pokemon.held_item_name,
          held_item: pokemon.held_item,
          dex_number: pokemon.dex_number,
          sprite_url: pokemon.sprite_url,
          species: pokemon.species,
          mote: pokemon.mote,
          form: get_form(pokemon),
          team: 'you',
          ev_speed: pokemon.ev_speed,
          iv_speed: pokemon.iv_speed,
          suffix: pokemon.suffix,
          impostered: pokemon.impostered,
          color: 'success'
        }
      });
      let enemy_pokemons = this.combat_info.enemy_trainer.current_team.team.map((pokemon) => {
        return {
          held_item_name: pokemon.held_item_name,
          nature: pokemon.nature,
          level: pokemon.level,
          item: pokemon.held_item_name,
          held_item: pokemon.held_item,
          dex_number: pokemon.dex_number,
          sprite_url: pokemon.sprite_url,
          species: pokemon.species,
          mote: pokemon.mote,
          form: get_form(pokemon),
          team: 'enemy',
          speed: pokemon.speed,
          ev_speed: pokemon.ev_speed,
          iv_speed: pokemon.iv_speed,
          suffix: pokemon.suffix,
          impostered: pokemon.impostered,
          color: 'teal'
        }
      });

      let pokemons = your_pokemons.concat(enemy_pokemons).map(pokemon => {
        return {
          sprite_url: get_sprite(pokemon.dex_number, pokemon.form),
          name: pokemon.name,
          mote: pokemon.mote,
          team: pokemon.team,
          speed: parseInt(get_stat(pokemon, 'speed').toFixed(0)),
          color: pokemon.color,
        }
      });

      let sorted_pokemons = pokemons.sort((prev_pokemon, pokemon) => {
        if (pokemon.speed < prev_pokemon.speed) {
          return -1;
        } else if (pokemon.speed > prev_pokemon.speed) {
          return 1;
        }
        return 0
      })

      return sorted_pokemons
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
