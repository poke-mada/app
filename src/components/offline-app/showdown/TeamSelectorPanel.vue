<template>
  <v-row>
    <v-col>
      <v-card>
        <template v-slot:text>
          <v-autocomplete label="Equipo Enemigo" :items="trainers" item-value="name" item-title="streamer_name"
                          v-model="selected_enemy_trainer"/>
        </template>
      </v-card>
    </v-col>
    <v-spacer></v-spacer>
    <v-col sm>
      <v-card>
        <template v-slot:text>
          <v-row>
            <v-spacer></v-spacer>
            <v-col>
              <v-btn color="teal accent-4" text="BUSCAR" @click="this.$emit('search', {
                selected_enemy_trainer,
                selected_trainer
              })"/>
            </v-col>
            <v-spacer></v-spacer>
          </v-row>
        </template>
      </v-card>
    </v-col>
    <v-spacer></v-spacer>
    <v-col>
      <v-card>
        <template v-slot:text>
          <v-autocomplete label="Tu Equipo" :items="trainers" item-value="name" item-title="streamer_name"
                          v-model="selected_trainer"/>
        </template>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import {session} from "@/store";

export default {
  name: "TeamSelectorPanel",
  emits: ['search'],
  props: {
    default_trainer: {
      type: String,
      required: false
    }
  },
  data() {
    return {
      selected_enemy_trainer: '',
      selected_trainer: this.default_trainer,
      trainers: [],
    }
  },
  created() {
    session.get('/api/trainers/list_trainers/').then((response) => {
      this.trainers = response.data
    });
  },
}
</script>

<style scoped>

</style>