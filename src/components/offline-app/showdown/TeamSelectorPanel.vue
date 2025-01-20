<template>
  <v-row className="w-100" justify="center" align="center">
    <v-col>
      <v-card>
        <template v-slot:text>
          <v-row>
            <v-col sm="12" xs="12" md="5">
              <v-autocomplete label="Tu Equipo" :items="trainers" variant="outlined" density="comfortable"
                              color="success"
                              item-value="id" item-title="streamer_name" v-model="selected_trainer"/>
            </v-col>
            <v-col sm="0" xs="0" md="2"></v-col>
            <v-col sm="12" xs="12" md="5">
              <v-autocomplete label="Equipo Enemigo" :items="trainers" variant="outlined" density="comfortable"
                              color="primary"
                              item-value="id" item-title="streamer_name" v-model="selected_enemy_trainer"/>
            </v-col>
          </v-row>
        </template>
        <template v-slot:actions>
          <v-row>
            <v-spacer/>
            <v-col sm="2" md="1">
              <v-btn color="teal accent-4" text="BUSCAR" @click="this.$emit('search', {
                selected_enemy_trainer,
                selected_trainer
              })"/>
            </v-col>
          </v-row>
        </template>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import {session} from "@/stores";

export default {
  name: "TeamSelectorPanel",
  emits: ['search'],
  props: {
    default_trainer: {
      type: Number,
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
